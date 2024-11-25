import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyTextBoxProps {
  overlayText: string;  // Text displayed by default
  copyText: string;     // Text copied to clipboard
}

const CopyTextBox: React.FC<CopyTextBoxProps> = ({ overlayText, copyText }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={copyToClipboard}
        className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg shadow-sm 
                 transition-all duration-200 ease-in-out
                 cursor-pointer group min-w-[120px] h-10"
        aria-label={isCopied ? "Copied" : "Copy to clipboard"}
      >
        <div className="relative overflow-hidden flex-1">
          {/* Default text with slide-out animation */}
          <span 
            className={`text-sm font-medium block transform transition-transform duration-200
                       ${isCopied ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}
                       group-hover:-translate-y-full group-hover:opacity-0`}
          >
            {overlayText}
          </span>
          
          {/* Hover text with slide-in animation */}
          <span 
            className={`text-sm font-medium absolute top-0 left-0 transform transition-transform duration-200
                       translate-y-full opacity-0
                       group-hover:translate-y-0 group-hover:opacity-100
                       ${isCopied ? 'translate-y-0 opacity-100' : ''}`}
          >
            {copyText}
          </span>
        </div>
        {/* Icon with fade transition */}
        <div className="relative w-4 h-4 flex-shrink-0">
          <Copy 
            className={`absolute w-4 h-4 transform transition-all duration-200
                       ${isCopied ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}
                       text-gray-400 group-hover:text-gray-600`}
          />
          <Check 
            className={`absolute w-4 h-4 transform transition-all duration-200
                       ${isCopied ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
                       text-green-500`}
          />
        </div>
      </button>
    </div>
  );
};

export default CopyTextBox;
