import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";

interface ImageUploaderProps {
  onUpload: (files: File[]) => void;
}

export default function ImageUploader({ onUpload }: ImageUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onUpload(acceptedFiles);
    },
    [onUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/jpg": [],
    },
  });

  return (
    <motion.div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive
          ? "border-green-500 bg-green-500 bg-opacity-10"
          : "border-gray-600"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <p className="text-lg mb-2 text-white">
        Drag 'n' drop some files here, or click to select files
      </p>
      <p className="text-sm text-gray-400">
        (Only *.jpeg, *.png, and *.gif images will be accepted)
      </p>
    </motion.div>
  );
}
