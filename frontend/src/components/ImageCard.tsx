import React from "react";
import { motion } from "framer-motion";
import { Download, Maximize2 } from "lucide-react";

interface ProcessedImage {
  id: string;
  original: File;
  processed: string;
  status: "processing" | "complete" | "error";
}

interface ImageCardProps {
  image: ProcessedImage;
  onClick: () => void;
}

export default function ImageCard({ image, onClick }: ImageCardProps) {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = image.processed;
    link.download = `processed_${image.original.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={
          image.status === "complete"
            ? image.processed
            : URL.createObjectURL(image.original)
        }
        alt={`Image ${image.id}`}
        className="w-full h-48 object-cover rounded-lg"
      />
      {image.status === "processing" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {image.status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <p className="text-red-500">Error processing image</p>
        </div>
      )}
      {image.status === "complete" && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-lg">
          <button
            onClick={handleDownload}
            className="p-2 bg-green-500 text-black rounded-full hover:bg-green-600 transition-colors mr-2"
          >
            <Download className="w-6 h-6" />
          </button>
          <button
            onClick={onClick}
            className="p-2 bg-green-500 text-black rounded-full hover:bg-green-600 transition-colors"
          >
            <Maximize2 className="w-6 h-6" />
          </button>
        </div>
      )}
    </motion.div>
  );
}
