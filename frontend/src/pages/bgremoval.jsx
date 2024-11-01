import React, { useState, useRef } from "react";
import {
  ImagePlus,
  Trash2,
  Upload,
  FileImage,
  Download,
  Loader2,
} from "lucide-react";

const BackgroundRemovalPage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [processedImages, setProcessedImages] = useState([]);
  const [processingStates, setProcessingStates] = useState({});
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const newFiles = Array.from(event.target.files).filter((file) =>
      ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
    );

    // Limit to 10 files
    const filesToAdd = newFiles.slice(0, 10 - selectedFiles.length);

    setSelectedFiles((prev) => [...prev, ...filesToAdd]);
  };

  const removeFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const processImage = async (file) => {
    // Create processing state for this file
    setProcessingStates((prev) => ({
      ...prev,
      [file.name]: true,
    }));

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("http://127.0.0.1:8000/remove-bg/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Image processing failed");
      }

      // Get the processed image blob
      const blob = await response.blob();
      const processedUrl = URL.createObjectURL(blob);

      // Add to processed images
      setProcessedImages((prev) => [
        ...prev,
        {
          original: file,
          processed: processedUrl,
        },
      ]);

      // Remove from selected files
      setSelectedFiles((prev) => prev.filter((f) => f !== file));
    } catch (error) {
      console.error("Processing error", error);
    } finally {
      // Remove processing state
      setProcessingStates((prev) => {
        const newStates = { ...prev };
        delete newStates[file.name];
        return newStates;
      });
    }
  };

  const processAllImages = () => {
    selectedFiles.forEach(processImage);
  };

  const downloadImage = (imageUrl, originalName) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `processed_${originalName}`;
    link.click();
  };

  const downloadAllImages = () => {
    processedImages.forEach((img) =>
      downloadImage(img.processed, img.original.name),
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Upload Section */}
        <div className="p-8 border-b">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Remove Background
            </h2>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png"
                onChange={handleFileSelect}
                ref={fileInputRef}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
              >
                <ImagePlus className="mr-2" /> Upload Images
              </button>
              {selectedFiles.length > 0 && (
                <button
                  onClick={processAllImages}
                  className="flex items-center bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600"
                >
                  <Upload className="mr-2" /> Process Images
                </button>
              )}
            </div>
          </div>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="grid grid-cols-5 gap-4">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="relative rounded-lg overflow-hidden shadow-md"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => removeFile(index)}
                      className="bg-red-500 text-white p-1 rounded-full"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="p-2 bg-gray-100 text-sm truncate">
                    {file.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Processed Images Section */}
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Processed Images ({processedImages.length})
            </h2>
            {processedImages.length > 0 && (
              <button
                onClick={downloadAllImages}
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600"
              >
                <Download className="mr-2" /> Download All
              </button>
            )}
          </div>

          {processedImages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileImage className="mx-auto mb-4" size={64} />
              <p>Processed images will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-4">
              {processedImages.map((img, index) => (
                <div
                  key={index}
                  className="rounded-lg overflow-hidden shadow-md relative"
                >
                  <img
                    src={img.processed}
                    alt={`Processed ${img.original.name}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() =>
                        downloadImage(img.processed, img.original.name)
                      }
                      className="bg-green-500 text-white p-1 rounded-full"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                  <div className="p-2 bg-gray-100 text-sm truncate">
                    {img.original.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackgroundRemovalPage;
