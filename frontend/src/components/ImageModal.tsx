import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, ZoomOut, X } from "lucide-react";

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
  const [zoom, setZoom] = useState(100);
  const [comparing, setComparing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = useCallback(
    () => setZoom((prev) => Math.min(prev + 10, 200)),
    [],
  );
  const handleZoomOut = useCallback(
    () => setZoom((prev) => Math.max(prev - 10, 50)),
    [],
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        setDragOffset({
          x: dragOffset.x + e.clientX - dragStart.x,
          y: dragOffset.y + e.clientY - dragStart.y,
        });
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    },
    [isDragging, dragOffset, dragStart],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-gray-800 p-4 rounded-lg max-w-4xl w-full mx-4 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white hover:text-green-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            ref={containerRef}
            className="relative overflow-hidden h-[60vh]"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <motion.img
              src={
                comparing
                  ? URL.createObjectURL(image.original)
                  : image.processed
              }
              alt={`Image ${image.id}`}
              style={{
                width: `${zoom}%`,
                x: dragOffset.x,
                y: dragOffset.y,
                cursor: isDragging ? "grabbing" : "grab",
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              drag={zoom > 100}
              dragConstraints={containerRef}
              dragElastic={0}
            />
          </div>
          <div className="mt-4 flex justify-center items-center space-x-4">
            <button
              onClick={handleZoomOut}
              className="p-2 bg-green-500 text-black rounded-full hover:bg-green-600 transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-white">{zoom}%</span>
            <button
              onClick={handleZoomIn}
              className="p-2 bg-green-500 text-black rounded-full hover:bg-green-600 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={comparing ? 100 : 0}
              onChange={(e) => setComparing(Number(e.target.value) > 50)}
              className="w-48"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
