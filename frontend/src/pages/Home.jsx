import React, { useState, useRef } from "react";
import { Upload, ImageRemove, Download, Gallery } from "lucide-react";
import { motion } from "framer-motion";

// Main Application Component
const BackgroundRemoverApp = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [processedImages, setProcessedImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedImageForPreview, setSelectedImageForPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    const validFiles = files.filter((file) =>
      validImageTypes.includes(file.type),
    );

    setSelectedImages((prevImages) => [
      ...prevImages,
      ...validFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      })),
    ]);
  };

  const removeImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const processImages = async () => {
    setIsProcessing(true);
    const processedResults = [];

    for (const imageData of selectedImages) {
      const formData = new FormData();
      formData.append("image", imageData.file);

      try {
        const response = await fetch("http://127.0.0.1:8000/remove-bg/", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const blob = await response.blob();
          processedResults.push({
            original: imageData.preview,
            processed: URL.createObjectURL(blob),
          });
        }
      } catch (error) {
        console.error("Error processing image:", error);
      }
    }

    setProcessedImages(processedResults);
    setSelectedImages([]);
    setIsProcessing(false);
  };

  const downloadImage = (imageUrl, filename) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllImages = () => {
    processedImages.forEach((image, index) => {
      downloadImage(image.processed, `processed_image_${index + 1}.png`);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 text-center">
          <h1 className="text-3xl font-bold">Background Remover</h1>
          <p className="mt-2 text-blue-100">
            Remove backgrounds from your images instantly
          </p>
        </div>

        {/* Upload Section */}
        {!isProcessing && selectedImages.length === 0 && (
          <div className="p-12 text-center">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/jpg"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />
            <motion.button
              onClick={() => fileInputRef.current.click()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 text-white px-6 py-3 rounded-full flex items-center mx-auto space-x-2"
            >
              <Upload />
              <span>Upload Images</span>
            </motion.button>
            <p className="mt-4 text-gray-500">
              Supported formats: JPG, JPEG, PNG | Max 5 images
            </p>
          </div>
        )}

        {/* Image Preview Section */}
        {selectedImages.length > 0 && !isProcessing && (
          <div className="p-6">
            <div className="grid grid-cols-4 gap-4 mb-6">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.preview}
                    alt={`Selected ${index}`}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => fileInputRef.current.click()}
                className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center space-x-2"
              >
                <Upload size={20} />
                <span>Add More</span>
              </button>
              <button
                onClick={processImages}
                className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center space-x-2"
              >
                <ImageRemove size={20} />
                <span>Remove Backgrounds</span>
              </button>
            </div>
          </div>
        )}

        {/* Processing Section */}
        {isProcessing && (
          <div className="p-12 text-center">
            <div className="animate-pulse text-blue-600">
              Processing images...
            </div>
          </div>
        )}

        {/* Processed Images Gallery */}
        {processedImages.length > 0 && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Processed Images</h2>
              <button
                onClick={downloadAllImages}
                className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center space-x-2"
              >
                <Download size={20} />
                <span>Download All</span>
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {processedImages.map((image, index) => (
                <div
                  key={index}
                  className="relative cursor-pointer"
                  onClick={() => setSelectedImageForPreview(image)}
                >
                  <img
                    src={image.processed}
                    alt={`Processed ${index}`}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {selectedImageForPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl max-w-4xl w-full grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-4">Original Image</h3>
              <img
                src={selectedImageForPreview.original}
                alt="Original"
                className="w-full rounded-lg"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Processed Image</h3>
              <img
                src={selectedImageForPreview.processed}
                alt="Processed"
                className="w-full rounded-lg"
              />
            </div>
            <div className="col-span-2 flex justify-center space-x-4 mt-4">
              <button
                onClick={() =>
                  downloadImage(
                    selectedImageForPreview.processed,
                    "processed_image.png",
                  )
                }
                className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center space-x-2"
              >
                <Download size={20} />
                <span>Download</span>
              </button>
              <button
                onClick={() => setSelectedImageForPreview(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundRemoverApp;
