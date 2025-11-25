

import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ChartComponent from "./ChartComponent";

export const ChartNode = Node.create({
  name: "chartNode",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      title: { default: "Chart Title" },
      chartType: { default: "bar" },
      data: { default: [] },
      isLive: { default: false },
      updateInterval: { default: 3000 },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-chart]",
        getAttrs: (dom) => {
          try {
            return {
              title: dom.getAttribute("data-chart-title") || "Chart Title",
              chartType: dom.getAttribute("data-chart-type") || "bar",
              data: JSON.parse(dom.getAttribute("data-chart-data") || "[]"),
              isLive: dom.getAttribute("data-chart-live") === "true",
              updateInterval: parseInt(
                dom.getAttribute("data-chart-interval") || "3000"
              ),
            };
          } catch (error) {
            console.error("Error parsing chart HTML:", error);
            return {};
          }
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      {
        "data-chart": "true",
        "data-chart-title": HTMLAttributes.title,
        "data-chart-type": HTMLAttributes.chartType,
        "data-chart-data": JSON.stringify(HTMLAttributes.data),
        "data-chart-live": HTMLAttributes.isLive,
        "data-chart-interval": HTMLAttributes.updateInterval,
      },
    ];
  },

  // ======================
  // 🔥 HTML OUTPUT
  // ======================
  toDOM(node) {
    return [
      "div",
      {
        "data-chart": "true",
        "data-chart-title": node.attrs.title || "Chart Title",
        "data-chart-type": node.attrs.chartType || "bar",
        "data-chart-data": JSON.stringify(node.attrs.data || []),
        "data-chart-live": node.attrs.isLive ? "true" : "false",
        "data-chart-interval": String(node.attrs.updateInterval || 3000),
      },
    ];
  },

  // ======================
  // 🔥 WHAT SHOWS IN EDITOR
  // ======================
  addNodeView() {
    return ReactNodeViewRenderer(ChartComponent);
  },
});


