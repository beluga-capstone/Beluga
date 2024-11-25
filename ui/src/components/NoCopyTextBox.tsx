import React from "react";

interface NoCopyTextBoxProps {
  overlayText: string;  // Text displayed by default
}

const NoCopyTextBox: React.FC<NoCopyTextBoxProps> = ({ overlayText }) => {
  return (
    <button
      className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg shadow-sm 
                min-w-[120px] h-10" 
    >
      <div className="relative overflow-hidden flex-1">
        <span className="text-sm font-medium">
          {overlayText}
        </span>
      </div>
    </button>
  );
};

export default NoCopyTextBox;
