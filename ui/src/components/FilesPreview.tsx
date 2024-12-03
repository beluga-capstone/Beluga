import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  materialDark,
  materialLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

interface FilesPreviewProps {
  files: File[];
}

const FilesPreview: React.FC<FilesPreviewProps> = ({ files }) => {
  const [filesText, setFilesText] = useState<String[]>([]);
  const [selectedFile, setSelectedFile] = useState(0);

  useEffect(() => {
    if (files.length === 0) {
      return;
    }

    const readers = files.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target) {
            resolve(e.target.result as string);
          }
        };
        reader.onerror = reject;
        reader.readAsText(file);
      });
    });

    Promise.all(readers).then((texts) => {
      setFilesText(texts);
    });
  }, [files]);

  return (
    <>
      <table>
        <tbody>
          <tr>
            {files.map((file, index) => (
              <td
                key={index}
                onClick={() => setSelectedFile(index)}
                className={`border border-on-surface p-4 ${
                  selectedFile === index ? "bg-on-surface" : ""
                }`}
              >
                {file.name}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <div className="border border-on-surface p-4 flex overflow-x-auto">
        {typeof filesText[selectedFile] === "string" && (
          <div className="flex-1">
            <SyntaxHighlighter
              language={files[selectedFile].name.split(".").pop() || "text"}
              style={
                window.matchMedia &&
                window.matchMedia("(prefers-color-scheme: dark)").matches
                  ? materialDark
                  : materialLight
              }
              showLineNumbers
            >
              {filesText[selectedFile]}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
    </>
  );
};

export default FilesPreview;
