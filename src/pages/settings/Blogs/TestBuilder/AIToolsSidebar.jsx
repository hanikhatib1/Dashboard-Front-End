import { useState } from "react";
/* import { MdOutlineArticle, MdAutoFixHigh } from "react-icons/md";
import { LuScanSearch, LuSparkles } from "react-icons/lu";
import { AiOutlineNumber } from "react-icons/ai";
import { IoBookOutline } from "react-icons/io5"; */
import {
  FileText as MdOutlineArticle,
  Wand2 as MdAutoFixHigh,
  ScanSearch as LuScanSearch,
  Sparkles as LuSparkles,
  Hash as AiOutlineNumber,
  BookOpen as IoBookOutline,
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import toast from "react-hot-toast";
// Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export default function AIToolsSidebar({ editor }) {
  const [loadingTool, setLoadingTool] = useState(null);
  const [results, setResults] = useState(null);
  const [showChatBox, setShowChatBox] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  // use gemini to run tool
  const runTool = async (type, buildPrompt, showInEditor = true) => {
    if (!editor) {
      toast.error("Editor is not ready!");

      return;
    }

    const userContent = editor.getHTML();
    if (
      !userContent ||
      userContent === "<p></p>" ||
      userContent.trim() === ""
    ) {
      toast.error("Please write some content in the editor first!");
      //   alert("Please write some content in the editor first!");
      return;
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      toast.error(" VITE_GEMINI_API_KEY is missing in your .env file");
      //   alert("❌ VITE_GEMINI_API_KEY is missing in your .env file");
      return;
    }

    setLoadingTool(type);
    setResults(null);

    // Select lighter model for analysis tools
    const analysisTools = ["plagiarism", "keywords", "readability"];
    const modelName = analysisTools.includes(type)
      ? "gemini-2.5-flash-lite"
      : "gemini-2.5-pro";

    const model = genAI.getGenerativeModel({ model: modelName });
    const prompt = buildPrompt(userContent);

    let retries = 3;
    let output = null;

    while (retries > 0) {
      try {
        const result = await model.generateContent(prompt);
        output = result.response.text();
        break;
      } catch (error) {
        if (error.message.includes("503")) {
          retries--;
          console.warn(`Model overloaded, retrying... (${3 - retries}/3)`);
          await new Promise((r) => setTimeout(r, 2000)); // 2s wait before retry
        } else {
          console.error("AI Error:", error);
          toast.error("An error occurred: " + error.message);
          //   alert("An error occurred: " + error.message);
          setLoadingTool(null);
          return;
        }
      }
    }

    if (!output) {
      toast.error("Service is busy. Please try again later.");
      //   alert("⚠️ Service is busy. Please try again later.");
      setLoadingTool(null);
      return;
    }

    // ✅ تنظيف الـ output من markdown code blocks
    output = output
      .replace(/```html\n?/gi, "")
      .replace(/```\n?/g, "")
      .trim();

    if (showInEditor) {
      editor.commands.setContent(output);
      toast.success("Content updated successfully!");
      //   alert("✅ Content updated successfully!");
    } else {
      setResults(output);
    }

    setLoadingTool(null);
  };
  // ai chat
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userMessage.trim() || isTyping) return;

    const userMsg = userMessage.trim();
    setUserMessage("");

    // Add user message
    setChatMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    try {
      const editorContent = editor?.getHTML() || "";
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
      });

      const prompt = `You are an AI Writing Assistant helping with blog content.
      
Current blog content:
${editorContent}

User question: ${userMsg}

Provide helpful, concise advice about writing, SEO, content structure, or grammar.
If the user asks you to modify the content, explain what you would change and why.
Keep your response under 200 words and format it clearly.`;

      const result = await model.generateContent(prompt);
      let response = result.response.text();

      // Clean markdown
      response = response
        .replace(/```html\n?/gi, "")
        .replace(/```\n?/g, "")
        .trim();

      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    } catch (error) {
      console.error("Chat Error:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const openChatBox = () => {
    setShowChatBox(true);
    if (chatMessages.length === 0) {
      setChatMessages([
        {
          role: "assistant",
          content: `Hello! I'm your AI Writing Assistant. I can help you with:

• Improving your writing style and clarity
• SEO optimization suggestions
• Content structure and flow
• Grammar and readability improvements

What would you like help with today?`,
        },
      ]);
    }
  };

  const AIButton = ({
    onClick,
    loading,
    icon: Icon,
    label,
    loadingText,
    variant = "primary",
  }) => {
    const variants = {
      primary: "bg-white text-gray-700 hover:bg-gray-300 cursor-pointer ",
      success: "bg-white text-gray-700 hover:bg-gray-300 cursor-pointer",
      info: "bg-white text-gray-700 hover:bg-gray-300 cursor-pointer",
      secondary: "bg-white text-gray-700 hover:bg-gray-300 cursor-pointer",
    };

    return (
      <button
        onClick={onClick}
        disabled={loading}
        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
          loading
            ? "opacity-50 cursor-not-allowed bg-gray-100"
            : variants[variant]
        } shadow-sm w-full`}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Icon className="text-xl text-blue" />
        )}
        <span className="font-medium text-sm">
          {loading ? loadingText : label}
        </span>
      </button>
    );
  };

  return (
    <div className="w-full border mt-7 p-3 border-gray-300 rounded-xl bg-white shadow-lg overflow-hidden">
      <div className="flex items-center gap-2 mb-4 ">
        <LuSparkles className="text-xl text-blue-600 " />
        <h2 className="text-lg font-semibold">AI Tools</h2>
      </div>

      <div className="flex flex-col gap-3">
        {/* Auto Format */}
        <AIButton
          onClick={() =>
            runTool(
              "format",
              (text) =>
                //                 `You are an HTML formatter. Your job is to clean and organize HTML content while preserving ALL existing formatting.

                // CRITICAL RULES - DO NOT VIOLATE:
                // 1. Return ONLY pure HTML code - NO markdown, NO \`\`\`html, NO explanations
                // 2. PRESERVE all existing HTML tags: <h1>, <h2>, <p>, <strong>, <em>, <u>, <a>, <ul>, <ol>, <table>, etc.
                // 3. PRESERVE all inline styles, classes, and attributes
                // 4. PRESERVE text colors, highlights, font sizes, and alignment
                // 5. PRESERVE all links with their href attributes
                // 6. PRESERVE all images with their src attributes
                // 7. PRESERVE all table structures
                // 8. DO NOT change the text content itself
                // 9. DO NOT add new content or remove existing content
                // 10. DO NOT change the meaning or structure

                // WHAT YOU SHOULD DO:
                // - Remove extra empty paragraphs like <p></p> or <p><br></p>
                // - Remove unnecessary whitespace between tags
                // - Ensure proper tag nesting
                // - Clean up malformed HTML
                // - Add missing closing tags if needed
                // - Organize nested lists properly
                // - Keep all formatting from the editor toolbar (bold, italic, underline, colors, etc.)

                // INPUT HTML:
                // ${text}

                // OUTPUT FORMAT: Return only the cleaned HTML, nothing else.`

                `You are an expert HTML content formatter. Your job is to convert text into properly formatted HTML with special attention to lists and bullet points.

CRITICAL OUTPUT RULES:
- Return ONLY the formatted HTML content
- DO NOT wrap the response in code blocks like triple backticks with html
- DO NOT add any markdown formatting to the response
- Return clean HTML that can be directly inserted into a contentEditable div

CRITICAL RULES FOR LIST DETECTION AND CONVERSION:

1. **Dash Lists**: Convert any lines starting with "-", "•", "*" to <ul><li>
   Example: "- Item 1\n- Item 2" becomes "<ul><li>Item 1</li><li>Item 2</li></ul>"

2. **Numbered Lists**: Convert "1. Item\n2. Item" patterns to <ol><li>
   Example: "1. First\n2. Second" becomes "<ol><li>First</li><li>Second</li></ol>"

3. **Pattern Lists**: Convert similar items listed consecutively to bullet points
   Example: "Industrial improvements, up 12%\nSupermarkets, increased 10%" becomes "<ul><li>Industrial improvements, up 12%</li><li>Supermarkets, increased 10%</li></ul>"

4. **Section Headers**: Lines ending with ":" often indicate lists follow
   Example: "Top 5 increases:\nItem 1\nItem 2" becomes "<h3>Top 5 increases:</h3><ul><li>Item 1</li><li>Item 2</li></ul>"

FORMATTING RULES:
- Use <p> tags for paragraphs
- Use <h2>, <h3> for headings  
- Use <strong> for important terms
- Use <ul><li> for unordered lists
- Use <ol><li> for numbered lists
- Maintain proper HTML structure

ALWAYS prioritize creating lists from similar consecutive items. When in doubt, make it a list.

 INPUT HTML:
 ${text}

 OUTPUT FORMAT: Return only the cleaned HTML, nothing else.
`
            )
          }
          loading={loadingTool === "format"}
          icon={MdAutoFixHigh}
          label="Auto Format"
          loadingText="Formatting..."
          variant="primary"
        />

        {/* AI Writing Assistant */}
        <AIButton
          onClick={openChatBox}
          loading={false}
          icon={MdOutlineArticle}
          label="AI Writing Assistant"
          loadingText=""
          variant="info"
        />
        {/* fix Grammer */}
        <AIButton
          onClick={() =>
            runTool(
              "fix grammer",
              (text) =>
                ` 'You are a meticulous grammar and language expert.',
        'Fix all grammar, spelling, punctuation, and syntax errors.',
        'Maintain the original meaning, tone, and style.',
        'Return only the corrected text without explanations.

INPUT HTML:
${text}

OUTPUT FORMAT: Return only the cleaned HTML, nothing else.`
            )
          }
          loading={loadingTool === "fix grammer"}
          icon={MdAutoFixHigh}
          label="Fix Grammer"
          loadingText="Fixing..."
          variant="primary"
        />
        {/* Check Plagiarism */}
        <AIButton
          onClick={() =>
            runTool(
              "plagiarism",
              (text) =>
                `Analyze this HTML content for plagiarism and originality.

INSTRUCTIONS:
- Check for repeated patterns or common phrases
- Provide an originality score
- Give suggestions to make content unique
- Format your response in clean HTML with headings and lists
- You can use markdown in the response since this is analysis

INPUT CONTENT:
${text}`,
              false
            )
          }
          loading={loadingTool === "plagiarism"}
          icon={LuScanSearch}
          label="Check Plagiarism"
          loadingText="Checking..."
          variant="secondary"
        />

        {/* Keyword Extraction */}
        <AIButton
          onClick={() =>
            runTool(
              "keywords",
              (text) =>
                `Extract SEO keywords from this HTML content.

INSTRUCTIONS:
- Identify primary, secondary, and long-tail keywords
- Rank by SEO importance
- Format your response in clean HTML with headings and ordered lists
- You can use markdown in the response since this is analysis

INPUT CONTENT:
${text}`,
              false
            )
          }
          loading={loadingTool === "keywords"}
          icon={AiOutlineNumber}
          label="Extract Keywords"
          loadingText="Extracting..."
          variant="secondary"
        />

        {/* Readability Analysis */}
        <AIButton
          onClick={() =>
            runTool(
              "readability",
              (text) =>
                `Analyze readability of this HTML content.

INSTRUCTIONS:
- Provide readability score (0-100)
- Specify writing level (beginner/intermediate/advanced)
- Calculate average sentence length
- Suggest improvements for readability, sentence structure, and word choice
- Format your response in clean HTML with headings and bullet points
- You can use markdown in the response since this is analysis

INPUT CONTENT:
${text}`,
              false
            )
          }
          loading={loadingTool === "readability"}
          icon={IoBookOutline}
          label="Readability Analysis"
          loadingText="Analyzing..."
          variant="secondary"
        />
        {/* Results Display */}
        {results && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-blue-900 font-Poppins">
                Analysis Results
              </h3>
              <button
                onClick={() => setResults(null)}
                className="text-blue-600 hover:text-blue-800 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div
              className="text-sm prose prose-sm max-w-none font-Poppins"
              dangerouslySetInnerHTML={{ __html: results }}
            />
          </div>
        )}
      </div>

      {/* Chat Box Modal */}
      {showChatBox && (
        <div
          className="fixed inset-0 bg-gray-400/5 bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            // Close only if clicking on the backdrop, not the modal content
            if (e.target === e.currentTarget) {
              setShowChatBox(false);
            }
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-5 rounded-t-2xl text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MdOutlineArticle className="text-3xl" />
                  <div>
                    <h3 className="font-bold text-lg">AI Writing Assistant</h3>
                    <p className="text-sm text-purple-100">
                      Get help with your content, writing style, and SEO
                      optimization
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChatBox(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-200 text-gray-800 shadow-sm"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2 text-purple-600">
                        <LuSparkles className="text-lg" />
                        <span className="font-semibold text-sm">
                          AI Assistant
                        </span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-purple-600 mb-2">
                      <LuSparkles className="text-lg" />
                      <span className="font-semibold text-sm">
                        AI Assistant
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div
                        className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleChatSubmit}
              className="p-4 bg-white border-t border-gray-200 rounded-b-2xl"
            >
              <div className="flex gap-3">
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleChatSubmit(e);
                    }
                  }}
                  placeholder="Ask me anything about your content..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!userMessage.trim() || isTyping}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
