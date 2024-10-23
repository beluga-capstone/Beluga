"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';

const ImportStudentsPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setData(results.data);
      },
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'text/csv': ['.csv'] } });

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-4xl mb-6">Import Students</h1>
      {data.length === 0 ? (
        <div {...getRootProps()} className="border-dashed border-2 border-gray-400 p-16 text-center">
          <input {...getInputProps()} />
          <p>Drag and drop a CSV file here, or click to select one</p>
        </div>
      ) : (
        <div className="mt-4">
          <h2 className="font-bold text-2xl mb-4">Parsed Data</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ImportStudentsPage;