import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Download, X } from "lucide-react";

export default function ProcessImages() {
  const location = useLocation();
  const [originalImages, setOriginalImages] = useState([]);
  const [processedImages, setProcessedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state && location.state.files) {
      setOriginalImages(location.state.files);
    }
  }, [location]);

  useEffect(() => {
    const processImages = async () => {
      for (const file of originalImages) {
        const formData = new FormData();
        formData.append("image", file);

        try {
          const response = await fetch(
            "http://127.0.0.1:8000/remove-bg/46ece259-33f7-47b1-8254-e42967724d79",
            {
              method: "POST",
              body: formData,
              credentials: "include", // Include credentials
            },
          );

          if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setProcessedImages((prev) => [
              ...prev,
              { original: file, processed: url },
            ]);
            setOriginalImages((prev) => prev.filter((img) => img !== file));
          } else {
            console.error("Error processing image:", file.name);
            setError(`Error processing image: ${file.name}`);
          }
        } catch (error) {
          console.error("Error processing image:", error);
          setError(`Error processing image: ${error.message}`);
        }
      }
    };

    if (originalImages.length > 0) {
      processImages();
    }
  }, [originalImages]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleDownloadAll = () => {
    processedImages.forEach((image, index) => {
      const link = document.createElement("a");
      link.href = image.processed;
      link.download = `processed_image_${index + 1}.png`;
      link.click();
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Image Processing</h1>
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Original Images</h2>
          <div className="grid grid-cols-2 gap-4">
            {originalImages.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Original ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                  Processing...
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Processed Images</h2>
          <div className="grid grid-cols-2 gap-4">
            {processedImages.map((image, index) => (
              <div
                key={index}
                className="relative cursor-pointer"
                onClick={() => handleImageClick(image)}
              >
                <img
                  src={image.processed}
                  alt={`Processed ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
          {processedImages.length > 0 && (
            <button
              onClick={handleDownloadAll}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              <Download className="inline-block mr-2" />
              Download All
            </button>
          )}
        </div>
      </div>
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-4xl w-full">
            <div className="flex justify-end mb-2">
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <h3 className="text-lg font-semibold mb-2">Original</h3>
                <img
                  src={URL.createObjectURL(selectedImage.original)}
                  alt="Original"
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="text-lg font-semibold mb-2">Processed</h3>
                <img
                  src={selectedImage.processed}
                  alt="Processed"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <a
                href={selectedImage.processed}
                download={`processed_image.png`}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                <Download className="inline-block mr-2" />
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
