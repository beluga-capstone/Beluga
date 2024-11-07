import JSZip from "jszip";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  materialDark,
  materialLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

interface SubmissionZoneProps {
  setSubmitIsEnabled: (enabled: boolean) => void;
  setZipFile: (file: File | null) => void;
}

const SubmissionZone: React.FC<SubmissionZoneProps> = ({
  setSubmitIsEnabled,
  setZipFile,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [filesText, setFilesText] = useState<String[]>([]);
  const [selectedFile, setSelectedFile] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const sortedFiles = acceptedFiles.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setData(sortedFiles);
    const zip = new JSZip();
    sortedFiles.forEach((file) => {
      zip.file(file.name, file);
    });
    zip.generateAsync({ type: "blob" }).then((blob) => {
      setZipFile(new File([blob], "submission.zip"));
    });
    setSubmitIsEnabled(true);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  useEffect(() => {
    if (data.length === 0) {
      return;
    }

    const readers = data.map((file) => {
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
  }, [data]);

  return (
    <div className="pt-8">
      {data.length === 0 ? (
        <div
          {...getRootProps()}
          className="border-dashed border-2 border-gray-400 p-16 text-center"
        >
          <input {...getInputProps()} />
          <p>Drag and drop a file here, or click to select</p>
        </div>
      ) : (
        <div>
          <h2 className="pb-2 font-bold">Files Selected</h2>
          <table>
            <tbody>
              {data.map((file, index) => (
                <tr key={index}>
                  <td
                    onClick={() => setSelectedFile(index)}
                    className={`border border-on-surface p-4 ${
                      selectedFile === index ? "bg-on-surface" : ""
                    }`}
                  >
                    {file.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border border-on-surface p-4 flex">
            {typeof filesText[selectedFile] === "string" && (
              <div className="flex-1">
                <SyntaxHighlighter
                  language={data[selectedFile].name.split(".").pop() || "text"}
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
        </div>
      )}
    </div>
  );
};

export default SubmissionZone;
