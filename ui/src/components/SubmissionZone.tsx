import JSZip from "jszip";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import FilesPreview from "./FilesPreview";

interface SubmissionZoneProps {
  setSubmitIsEnabled: (enabled: boolean) => void;
  setZipFile: (file: File | null) => void;
}

const SubmissionZone: React.FC<SubmissionZoneProps> = ({
  setSubmitIsEnabled,
  setZipFile,
}) => {
  const [data, setData] = useState<any[]>([]);

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
          <FilesPreview files={data}/>
        </div>
      )}
    </div>
  );
};

export default SubmissionZone;
