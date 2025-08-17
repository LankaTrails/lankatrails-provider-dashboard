import React, { useState, useCallback } from "react";
import { Upload, X } from "lucide-react";
import type { ImageFile } from "@/types/serviceTypes";

interface ImageUploadProps {
  images: ImageFile[];
  onImagesChange: (images: ImageFile[]) => void;
  selectedImageIndex: number;
  onSelectedImageChange: (index: number) => void;
  onImageDelete?: (imageId: string, imageUrl?: string) => void; // Optional custom delete handler
}

const baseUrl = import.meta.env.VITE_BASE_URL;

const ImageUploadComponent: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  selectedImageIndex,
  onSelectedImageChange,
  onImageDelete, // Custom delete handler
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));

      if (imageFiles.length > 0) {
        const newImages: ImageFile[] = [];
        imageFiles.forEach((file) => {
          const id = Math.random().toString(36).substr(2, 9);
          const url = URL.createObjectURL(file);
          newImages.push({ id, file, url });
        });
        onImagesChange([...images, ...newImages]);
        if (images.length === 0) {
          onSelectedImageChange(0);
        }
      }
    },
    [images, onImagesChange, onSelectedImageChange]
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages: ImageFile[] = [];
      Array.from(files).forEach((file) => {
        const id = Math.random().toString(36).substr(2, 9);
        const url = URL.createObjectURL(file);
        newImages.push({ id, file, url });
      });
      onImagesChange([...images, ...newImages]);
      if (images.length === 0) {
        onSelectedImageChange(0);
      }
    }
  };

  const handleImageRemove = (imageId: string) => {
    if (onImageDelete) {
      // Use custom delete handler if provided
      const image = images.find((img) => img.id === imageId);
      onImageDelete(imageId, image?.url);
    } else {
      // Default behavior - remove from images array
      const newImages = images.filter((img) => img.id !== imageId);
      onImagesChange(newImages);
      if (selectedImageIndex >= newImages.length && newImages.length > 0) {
        onSelectedImageChange(newImages.length - 1);
      } else if (newImages.length === 0) {
        onSelectedImageChange(0);
      }
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Images
        </label>
        <div
          className={`flex items-center justify-center w-full transition-colors ${
            isDragOver ? "bg-blue-50 border-blue-300" : "bg-gray-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-100">
            {images.length > 0 ? (
              <div className="relative w-full h-full">
                <img
                  src={baseUrl + images[selectedImageIndex]?.url}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  {selectedImageIndex + 1} / {images.length}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {images.length > 0 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`relative flex-shrink-0 w-28 h-16 rounded-lg overflow-hidden cursor-pointer border-2 ${
                index === selectedImageIndex
                  ? "border-primary-400"
                  : "border-gray-300"
              }`}
              onClick={() => onSelectedImageChange(index)}
            >
              <img
                src={baseUrl + image.url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageRemove(image.id);
                }}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-2 h-2" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploadComponent;
