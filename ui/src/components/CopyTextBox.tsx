import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

const CopyTextBox = ({ text }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <button
      onClick={copyToClipboard}
      className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg shadow-sm transition-colors cursor-pointer group"
      aria-label={isCopied ? "Copied" : "Copy to clipboard"}
    >
      <span className="text-sm font-medium">{text}</span>
      {isCopied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
      )}
      
      {isCopied && (
        <span className="absolute -top-8 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg">
          Copied!
        </span>
      )}
    </button>
  );
};

export default CopyTextBox;
