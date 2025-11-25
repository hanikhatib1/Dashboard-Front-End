// SeoAnalyzer.jsx
import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Doughnut } from "react-chartjs-2";
/**
 * Props:
 *  - title: string
 *  - metaDescription: string
 *  - contentHtml: string (full HTML from tiptap)
 *  - focusKeyword: string
 *  - geminiDirect: { url, apiKey } optional - ONLY for quick testing (not secure)
 */
export default function SeoAnalyzer({
  title = "",
  metaDescription = "",
  contentHtml = "",
  focusKeyword = "",
  geminiDirect = null,
}) {
  const [loading, setLoading] = useState(false);
  const [manualResult, setManualResult] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [combined, setCombined] = useState(null);
  const [error, setError] = useState(null);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showCombinedModal, setShowCombinedModal] = useState(false);

  function stripHtml(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html || "";
    return tmp.textContent || tmp.innerText || "";
  }

  // --- Manual scoring functions ---
  function scoreContentQuality(text, title, imagesWithAlt = false) {
    let score = 0;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    if (words >= 300) score += 40;
    if (title && title.trim().length > 0) score += 10;
    // quick heading detection
    const hasHeading = /<h[1-6][^>]*>/i.test(contentHtml);
    if (hasHeading) score += 20;
    if (imagesWithAlt) score += 20;
    // paragraph length heuristic
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;
    if (sentences >= 3) score += 10;
    return Math.min(100, score);
  }

  function scoreKeywords(text, title, meta, keyword) {
    if (!keyword) return 0;
    const lower = text.toLowerCase();
    const kw = keyword.toLowerCase();
    let score = 0;
    if (title.toLowerCase().includes(kw)) score += 20;
    if (lower.slice(0, 300).includes(kw)) score += 20;
    if (meta.toLowerCase().includes(kw)) score += 20;
    try {
      const freq = (
        lower.match(new RegExp(`\\b${escapeRegExp(kw)}\\b`, "g")) || []
      ).length;
      if (freq >= 3) score += 30;
      else if (freq === 2) score += 20;
      else if (freq === 1) score += 10;
    } catch (e) {
      // ignore regex issues
    }
    // URL slug check is omitted because component does not know URL
    return Math.min(100, score);
  }

  function scoreMetaInformation(meta, title, keyword) {
    let score = 0;
    if (meta && meta.trim().length > 0) score += 20;
    if (meta.length >= 150 && meta.length <= 160) score += 40;
    if (meta.toLowerCase().includes(keyword.toLowerCase())) score += 20;
    if (title.length >= 40 && title.length <= 60) score += 20;
    return Math.min(100, score);
  }

  function scoreReadability(text) {
    // Very simple heuristics for client-side
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    const words = text.trim().split(/\s+/).filter(Boolean);
    const avgWordsPerSentence = sentences.length
      ? words.length / sentences.length
      : 0;
    let score = 0;
    if (avgWordsPerSentence < 20) score += 30;
    // bullet lists
    if (/-\s|\*\s|<ul|<ol/i.test(contentHtml)) score += 20;
    // short paragraphs
    const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0);
    if (paragraphs.length && paragraphs.every((p) => p.length < 300))
      score += 20;
    // naive "Flesch-like"
    const syllableEst = Math.max(1, Math.round(words.length * 1.5)); // rough
    const flesch = Math.max(
      0,
      Math.round(
        206.835 -
          1.015 * avgWordsPerSentence -
          (84.6 * syllableEst) / Math.max(1, words.length)
      )
    );
    if (flesch > 60) score += 30;
    return Math.min(100, score);
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // Run the manual scoring
  function computeManual() {
    const text = stripHtml(contentHtml);
   
    const imagesWithAlt = /<img[^>]*alt=['"][^'"]+['"]/i.test(contentHtml);
    const contentScore = scoreContentQuality(text, title, imagesWithAlt);
    const keywordsScore = scoreKeywords(
      text,
      title,
      metaDescription,
      focusKeyword || ""
    );
    const metaScore = scoreMetaInformation(
      metaDescription,
      title,
      focusKeyword || ""
    );
    const readabilityScore = scoreReadability(text);
    const total = Math.round(
      (contentScore + keywordsScore + metaScore + readabilityScore) / 4
    );
    return {
      contentScore,
      keywordsScore,
      metaScore,
      readabilityScore,
      total,
    };
  }

  // --- AI (Gemini) call ---
  // NOTE: geminiDirect is optional object { url, apiKey } for direct client testing.
  // Recommended: run a secure server/proxy and call it instead. See notes below.
  async function callGeminiAnalysis({
    title,
    metaDescription,
    content,
    focusKeyword,
  }) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing Gemini API Key");

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const prompt = `
You are an SEO assistant. Analyze the blog and return JSON ONLY in this exact shape:

{
  "contentQualityScore": number (0-100),
  "keywordsScore": number (0-100),
  "metaScore": number (0-100),
  "readabilityScore": number (0-100),
  "totalScore": number (0-100),
  "recommendations": ["short suggestions only"]
}

Do NOT include explanations outside JSON.

TITLE: ${title}
META: ${metaDescription}
FOCUS_KEYWORD: ${focusKeyword}
CONTENT: ${content}
  `.trim();

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();

      // محاولة لاستخراج JSON
      let jsonText = text;

      // لو النموذج رجع Markdown أو كلام زيادة
      const match = text.match(/\{[\s\S]*\}/);
      if (match) jsonText = match[0];

      const parsed = JSON.parse(jsonText);
      return parsed;
    } catch (e) {
      console.error("Gemini JSON Error:", e);
      throw new Error("Failed to analyze SEO content");
    }
  }

  // Merge manual + AI results (simple average)
  function mergeResults(manual, ai) {
    if (!manual && !ai) return null;
    if (!ai) return { ...manual, source: "manual" };
    if (!manual) return { ...ai, source: "ai" };
    const merged = {
      contentQuality: Math.round(
        (manual.contentScore + ai.contentQualityScore) / 2
      ),
      keywords: Math.round((manual.keywordsScore + ai.keywordsScore) / 2),
      metaInfo: Math.round((manual.metaScore + ai.metaScore) / 2),
      readability: Math.round(
        (manual.readabilityScore + ai.readabilityScore) / 2
      ),
    };
    merged.totalScore = Math.round(
      (merged.contentQuality +
        merged.keywords +
        merged.metaInfo +
        merged.readability) /
        4
    );
    merged.recommendations = [
      ...(ai.recommendations || []),
      // Add a few automatic suggestions from manual heuristics:
      ...(manual.contentScore < 60
        ? ["Increase content length and add descriptive headings."]
        : []),
      ...(manual.metaScore < 60
        ? ["Improve meta description to 150-160 chars and include the keyword."]
        : []),
    ];
    return merged;
  }

  // Handle click
  async function handleAnalyze() {
    setError(null);
    setAiResult(null);
    setManualResult(null);
    setCombined(null);

    try {
      const textOnly = stripHtml(contentHtml);
      if (textOnly.length < 50) {
        setError("Content too short — add at least 50 characters.");
        return;
      }
      setLoading(true);

      const manual = computeManual();
      setManualResult(manual);

      // call Gemini
      let ai = null;
      try {
        ai = await callGeminiAnalysis({
          title,
          metaDescription,
          content: textOnly,
          focusKeyword,
        });
        setAiResult(ai);
      } catch (aiErr) {
        console.warn("AI analysis failed:", aiErr);
        // proceed with manual only
      }
      // setShowSeoModal(true);
      const merged = mergeResults(manual, ai || null);
      setCombined(merged);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }
  function handleManualOnly() {
     const text = stripHtml(contentHtml);

  if (text.length < 50) {
    setError("Please enter content first (at least 50 characters).");
    return;
  }
    const manual = computeManual();
    setManualResult(manual);
    setShowManualModal(true);
  }
  async function handleAiOnly() {
    try {
      setLoading(true);
      const ai = await callGeminiAnalysis({
        title,
        metaDescription,
        content: stripHtml(contentHtml),
        focusKeyword,
      });
      setAiResult(ai);
      setShowAiModal(true);
    } finally {
      setLoading(false);
    }
  }
  async function handleCombined() {
      const text = stripHtml(contentHtml);

  if (text.length < 50) {
    setError("Please enter content first (at least 50 characters).");
    return;
  }

    try {
      setLoading(true);

      const manual = computeManual();
      const ai = await callGeminiAnalysis({
        title,
        metaDescription,
        content: stripHtml(contentHtml),
        focusKeyword,
      });

      const merged = mergeResults(manual, ai);
      setCombined(merged);
      setShowCombinedModal(true);
    } finally {
      setLoading(false);
    }
  }

  // Simple UI helpers
  function Bar({ label, value }) {
    return (
      <div className="w-full mb-3">
        <div className="flex justify-between mb-1">
          <span>{label}</span>
          <span>{value}/100</span>
        </div>
        <div className="h-3 w-full bg-gray-200 rounded">
          <div
            className="h-3 bg-blue-600 rounded"
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="mb-4 flex flex-col gap-2">
        <div className="flex flex-col gap-3 mb-4">
          <button
            type="Button"
            onClick={handleManualOnly}
            className="px-4 py-2 bg-gray-700 text-white rounded cursor-pointer"
          >
             Analyze SEO Score
          </button>

          <button
            type="Button"
            onClick={handleAiOnly}
            className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
          >
            Analyze SEO Score (AI)
          </button>

          <button
            type="Button"
            onClick={handleCombined}
            className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
          >
            Combined(Manual + AI)
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{error}</div>
      )}

      {showManualModal && manualResult && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[450px] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              Manual SEO Results
            </h2>

            <Bar label="Total" value={manualResult.total} />

            <div className="mt-4">
              <Bar label="Content Quality" value={manualResult.contentScore} />
              <Bar label="Keywords" value={manualResult.keywordsScore} />
              <Bar label="Meta Info" value={manualResult.metaScore} />
              <Bar label="Readability" value={manualResult.readabilityScore} />
            </div>

            <button
              onClick={() => setShowManualModal(false)}
              className="mt-5 w-full py-2 bg-gray-800 text-white rounded-lg cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showAiModal && aiResult && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[450px] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              AI SEO Results
            </h2>

            <Bar label="Total" value={aiResult.totalScore} />

            <div className="mt-4">
              <Bar
                label="Content Quality"
                value={aiResult.contentQualityScore}
              />
              <Bar label="Keywords" value={aiResult.keywordsScore} />
              <Bar label="Meta Info" value={aiResult.metaScore} />
              <Bar label="Readability" value={aiResult.readabilityScore} />
            </div>

            <h3 className="font-semibold mt-3 mb-1">Recommendations</h3>
            <ul className="list-disc ml-5">
              {aiResult.recommendations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>

            <button
              onClick={() => setShowAiModal(false)}
              className="mt-5 w-full py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showCombinedModal && combined && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[450px] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              Combined SEO Score
            </h2>

            <Bar label="Total" value={combined.totalScore} />

            <div className="mt-4">
              <Bar label="Content Quality" value={combined.contentQuality} />
              <Bar label="Keywords" value={combined.keywords} />
              <Bar label="Meta Info" value={combined.metaInfo} />
              <Bar label="Readability" value={combined.readability} />
            </div>

            <ul className="mt-3 list-disc ml-5">
              {combined.recommendations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>

            <button
              onClick={() => setShowCombinedModal(false)}
              className="mt-5 w-full py-2 bg-green-600 text-white rounded-lg cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
