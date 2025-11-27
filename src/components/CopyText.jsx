import { Check, CopyIcon } from "lucide-react";
import React, { useState } from "react";

const CopyText = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(Math.floor(Number(text) / 10));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex gap-1">
      <p className="text-body">$ {Number(text).toLocaleString()}</p>
      <button onClick={() => copy(text)} className=" rounded">
        {copied ? <Check /> : <CopyIcon />}
      </button>
    </div>
  );
};

export default CopyText;
