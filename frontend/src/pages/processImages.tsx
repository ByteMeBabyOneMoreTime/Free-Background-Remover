import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ImageCard from "../components/ImageCard";
import ImageModal from "../components/ImageModal";
import ImageUploader from "../components/Imageuploader";

interface ProcessedImage {
  id: string;
  original: File;
  processed: string;
  status: "processing" | "complete" | "error";
}

export default function ProcessedImages() {
  const location = useLocation();
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<ProcessedImage | null>(
    null,
  );
  const removeBgKey = import.meta.env.VITE_REMOVE_BG_KEY;

  useEffect(() => {
    const state = location.state as { files: File[] } | undefined;
    if (state && state.files) {
      const newImages = state.files.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        original: file,
        processed: "",
        status: "processing" as const,
      }));
      setImages(newImages);
      processImages(newImages);
    }
  }, [location]);

  const processImages = async (imagesToProcess: ProcessedImage[]) => {
    for (const image of imagesToProcess) {
      const formData = new FormData();
      formData.append("image", image.original);

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/remove-bg/${removeBgKey}`,
          {
            method: "POST",
            body: formData,
          },
        );

        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setImages((prev) =>
            prev.map((img) =>
              img.id === image.id
                ? { ...img, processed: url, status: "complete" }
                : img,
            ),
          );
        } else {
          setImages((prev) =>
            prev.map((img) =>
              img.id === image.id ? { ...img, status: "error" } : img,
            ),
          );
          console.error("Error processing image:", image.original.name);
        }
      } catch (error) {
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id ? { ...img, status: "error" } : img,
          ),
        );
        console.error("Error processing image:", error);
      }
    }
  };

  const handleImageClick = (image: ProcessedImage) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleNewImages = (files: File[]) => {
    const newImages = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      original: file,
      processed: "",
      status: "processing" as const,
    }));
    setImages((prev) => [...prev, ...newImages]);
    processImages(newImages);
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-green-500 mb-8">
        Processed Images
      </h1>
      <ImageUploader onUpload={handleNewImages} />
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            onClick={() => handleImageClick(image)}
          />
        ))}
      </motion.div>
      {selectedImage && (
        <ImageModal image={selectedImage} onClose={handleCloseModal} />
      )}
    </main>
  );
}
