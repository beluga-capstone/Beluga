import React, { useState } from "react";

interface CopyTextBoxProps {
  overlayText: string;  // Text displayed by default
}

const NoCopyTextBox: React.FC<CopyTextBoxProps> = ({ overlayText}) => {

  return (
      <button
        className="inline-flex items-center gap-2 px-4 py-2 mr-2 border rounded-lg shadow-sm" 
      >
        <div className="relative overflow-hidden">
          {/* Default text with slide-out animation */}
          <span 
            className={`text-sm font-medium`}
          >
            {overlayText}
          </span>
          
        </div>
      </button>
  );
};

export default NoCopyTextBox;

