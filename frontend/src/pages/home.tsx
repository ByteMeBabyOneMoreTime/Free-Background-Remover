import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Image as ImageIcon, AlertCircle } from "lucide-react";

interface NavigationState {
  files: File[];
}

export default function Home(): JSX.Element {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const navigate = useNavigate();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const handleRemoveBackground = (): void => {
    if (selectedFiles.length > 0) {
      navigate("/process", { state: { files: selectedFiles } as NavigationState });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Remove Background from Your Images for Free
      </h1>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="flex flex-col items-center">
                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                <p className="text-sm text-gray-500">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">(JPG, JPEG, PNG only)</p>
              </div>
            </div>
            <input
              id="file-upload"
              type="file"
              multiple
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
        {selectedFiles.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">
              {selectedFiles.length} file(s) selected
            </p>
          </div>
        )}
        <button
          onClick={handleRemoveBackground}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          disabled={selectedFiles.length === 0}
        >
          Remove Background
        </button>
        <div className="mt-4">
          <div className="flex items-center text-sm text-gray-600">
            <AlertCircle className="w-4 h-4 mr-2" />
            <p>Please upload only JPG, JPEG, or PNG images.</p>
          </div>
          <div className="flex items-center text-sm text-gray-600 mt-2">
            <ImageIcon className="w-4 h-4 mr-2" />
            <p>Maximum file size: 10MB per image</p>
          </div>
        </div>
      </div>
    </div>
  );
}
