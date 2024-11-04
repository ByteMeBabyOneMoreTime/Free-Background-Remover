import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye } from "lucide-react";

interface ProcessedImage {
  id: string;
  original: File;
  processed: string;
  status: "processing" | "complete" | "error";
}

interface ImageModalProps {
  image: ProcessedImage;
  onClose: () => void;
}

export default function ImageModal({ image, onClose }: ImageModalProps) {
  const [isComparing, setIsComparing] = useState(false);
  const [compareProgress, setCompareProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  }, []);

  const handleCompareStart = () => setIsComparing(true);
  const handleCompareEnd = () => setIsComparing(false);

  useEffect(() => {
    let animationFrame: number;

    const animateComparison = () => {
      if (isComparing && compareProgress < 100) {
        setCompareProgress((prev) => Math.min(prev + 2, 100));
      } else if (!isComparing && compareProgress > 0) {
        setCompareProgress((prev) => Math.max(prev - 2, 0));
      }

      animationFrame = requestAnimationFrame(animateComparison);
    };

    animationFrame = requestAnimationFrame(animateComparison);

    return () => cancelAnimationFrame(animationFrame);
  }, [isComparing, compareProgress]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-gray-900 p-4 rounded-lg max-w-4xl w-full mx-4 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white hover:text-green-500 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            ref={containerRef}
            className="relative overflow-hidden h-[60vh] rounded-lg"
            onMouseMove={handleMouseMove}
          >
            <img
              ref={imageRef}
              src={image.processed}
              alt={`Processed Image ${image.id}`}
              className="w-full h-full object-contain"
            />
            <motion.div
              className="absolute inset-y-0 left-0 bg-gray-900"
              initial={{ width: 0 }}
              animate={{ width: `${compareProgress}%` }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            >
              <img
                src={URL.createObjectURL(image.original)}
                alt={`Original Image ${image.id}`}
                className="w-full h-full object-contain"
              />
            </motion.div>
            <div
              className="absolute w-20 h-20 border-2 border-green-500 rounded-full pointer-events-none"
              style={{
                left: mousePosition.x - 40,
                top: mousePosition.y - 40,
                display: isComparing ? "none" : "block",
              }}
            >
              <div className="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-full" />
              <div
                className="absolute inset-0 bg-no-repeat bg-cover rounded-full"
                style={{
                  backgroundImage: `url(${image.processed})`,
                  backgroundPosition: `${-mousePosition.x + 40}px ${-mousePosition.y + 40}px`,
                  transform: "scale(2)",
                }}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <button
              onMouseDown={handleCompareStart}
              onMouseUp={handleCompareEnd}
              onMouseLeave={handleCompareEnd}
              className="p-2 bg-green-500 text-black rounded-full hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              aria-label="Compare original and processed images"
            >
              <Eye className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
