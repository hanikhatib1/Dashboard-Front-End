import React from "react";
import Linkify from "react-linkify";

const BlogDescription = ({ description, renameLinks = [] }) => {
  const renderLine = (line, index) => {
    const trimmedLine = line.trimStart();

    if (trimmedLine.startsWith("### ")) {
      return (
        <h3 key={index} className="text-sm md:text-xl font-bold">
          {trimmedLine.replace(/^###\s/, "")}
        </h3>
      );
    } else if (trimmedLine.startsWith("## ")) {
      return (
        <h2 key={index} className="text-xl md:text-2xl font-bold">
          {trimmedLine.replace(/^##\s/, "")}
        </h2>
      );
    } else if (trimmedLine.startsWith("# ")) {
      return (
        <h1 key={index} className="text-2xl md:text-3xl font-bold">
          {trimmedLine.replace(/^#\s/, "")}
        </h1>
      );
    } else if (trimmedLine.trim() === "") {
      return <br key={index} />;
    } else {
      return (
        <p key={index} className="text-[18px] font-[500] text-black">
          {trimmedLine}
        </p>
      );
    }
  };

  return (
    <Linkify
      componentDecorator={(href, text, key) => {
        let safeHref = href;
        if (safeHref.startsWith("http://")) {
          safeHref = safeHref.replace("http://", "https://");
        }

        return (
          <a
            key={key}
            href={safeHref}
            rel="noopener noreferrer"
            className="text-blue-600 underline"
            target="_blank"
          >
            {renameLinks.find(
              (link) =>
                link.link.replace("http://", "").replace("https://", "") ===
                href.replace("http://", "").replace("https://", "")
            )?.rename || text}
          </a>
        );
      }}
    >
      <div className="space-y-2 font-[family-name:var(--font-geist-sans)]">
        {description.split("\n").map(renderLine)}
      </div>
    </Linkify>
  );
};

export default BlogDescription;
