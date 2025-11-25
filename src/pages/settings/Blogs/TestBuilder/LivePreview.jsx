





// LivePreview.jsx
import React from "react";
import ChartComponent from "./ChartComponent";

const LivePreview = ({ content }) => {
  const renderContent = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    return Array.from(doc.body.childNodes).map((node, i) => {
      // -------------------------
      // 🟦 لو دا chart node
      // -------------------------
      if (node.nodeType === 1 && node.hasAttribute("data-chart")) {
        let chartData = [];
        try {
          chartData = JSON.parse(node.getAttribute("data-chart-data"));
        } catch (error) {
          console.error("Invalid chart data JSON", error);
        }

        return (
          <ChartComponent
            key={i}
            nodeViewProps={{
              node: {
                attrs: {
                  title: node.getAttribute("data-chart-title"),
                  chartType: node.getAttribute("data-chart-type"),
                  data: chartData,
                  isLive: node.getAttribute("data-chart-live") === "true",
                  updateInterval: parseInt(node.getAttribute("data-chart-interval")) || 3000,
                }
              },
              updateAttributes: () => {},
              deleteNode: () => {}
            }}
          />
        );
      }

      // -------------------------
      // 🟩 HTML العادي
      // -------------------------
      if (node.nodeType === 1) {
        return (
          <div
            key={i}
            dangerouslySetInnerHTML={{ __html: node.outerHTML }}
          />
        );
      }

      if (node.nodeType === 3 && node.textContent.trim() !== "") {
        return <span key={i}>{node.textContent}</span>;
      }

      return null;
    });
  };

  return <div className="blog-content">{renderContent(content)}</div>;
};

export default LivePreview;

