import React, { useState, useRef, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Upload, Trash2 } from "lucide-react";

export default function Home() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentProcessingIndex, setCurrentProcessingIndex] = useState<
    number | null
  >(null);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    }
  };

  const handleRemoveBackground = () => {
    if (selectedFiles.length > 0) {
      navigate("/processed", { state: { files: selectedFiles } });
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="w-full lg:w-1/2">
          <img
            src="/pic2.gif"
            alt="Background Removal Process"
            className="w-full h-auto rounded-lg shadow-lg drop-shadow-[0_0_8px_#fff] drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]"
          />
        </div>
        <div className="w-full lg:w-1/2 space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-green-500"
          >
            Free Background Removal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-300"
          >
            Remove backgrounds from your images instantly with our powerful
            AI-driven tool.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gray-800 rounded-lg p-8"
          >
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex items-center justify-center w-full h-48 border-2 border-green-500 border-dashed rounded-lg hover:bg-gray-700 transition-colors relative overflow-hidden">
                <div className="flex flex-col items-center relative z-10">
                  <Upload className="w-12 h-12 mb-4 text-green-500" />
                  <p className="text-lg text-green-500">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-400">(JPG, JPEG, PNG only)</p>
                </div>
                <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-1 opacity-10">
                  {Array.from({ length: 16 }).map((_, index) => (
                    <div key={index} className="bg-green-500"></div>
                  ))}
                </div>
              </div>
              <input
                id="file-upload"
                type="file"
                multiple
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </label>
            {selectedFiles.length > 0 && (
              <p className="mt-4 text-center text-gray-300">
                {selectedFiles.length} file(s) selected
              </p>
            )}
            <AnimatePresence>
              {selectedFiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-8"
                >
                  <h3 className="text-lg font-semibold mb-4 text-white">
                    Selected Images
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {selectedFiles.map((file, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="relative group"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Selected ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                          <button
                            onClick={() => removeFile(index)}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {currentProcessingIndex === index && (
                          <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: "0%" }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                            className="absolute inset-0 bg-black bg-opacity-60 rounded-lg"
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handleRemoveBackground}
              disabled={selectedFiles.length === 0}
              className="mt-6 w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Remove Background
            </button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
