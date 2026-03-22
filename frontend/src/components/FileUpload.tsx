"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function FileUpload({ onUpload }: { onUpload: (file: File) => void }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }
    setFile(selectedFile);
  };

  const submitFile = () => {
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="w-full mt-6">
      <div 
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        } ${file ? "bg-green-50 border-green-400" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input 
          ref={inputRef}
          type="file" 
          accept=".pdf" 
          className="hidden" 
          onChange={handleChange} 
        />
        
        {file ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-3 bg-green-100 rounded-full text-green-600">
              <CheckCircle className="w-8 h-8" />
            </div>
            <p className="font-semibold text-gray-800">{file.name}</p>
            <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3 cursor-pointer">
            <div className={`p-3 rounded-full ${dragActive ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <p className="font-bold text-gray-700">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500 mt-1">PDF format (Max. 5MB)</p>
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={submitFile}
        disabled={!file}
        className={`w-full mt-4 py-3 rounded-lg font-bold text-white transition-all shadow-md ${
          file 
            ? "bg-blue-600 hover:bg-blue-700 shadow-blue-600/30" 
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        {file ? "Roast My Resume Now 🔥" : "Select a Resume First"}
      </button>
    </div>
  );
}
