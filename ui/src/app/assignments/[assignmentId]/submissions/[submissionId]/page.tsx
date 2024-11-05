"use client";

import { DEFAULT_FILES } from "@/constants";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  materialDark,
  materialLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

const SubmissionPage = () => {
  return (
    <div className="container mx-auto p-4">
      <SyntaxHighlighter
        language="python"
        style={
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? materialDark
            : materialLight
        }
        showLineNumbers
      >
        {DEFAULT_FILES[0]}
      </SyntaxHighlighter>
    </div>
  );
};

export default SubmissionPage;
