import React, { useRef, useState } from "react";
import { X, File, Upload, AlertCircle } from "lucide-react";

interface FileUploadGroupProps {
  label: string;
  required?: boolean;
  uploadedFiles: File[];
  onFilesChange: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  disabled?: boolean;
  error?: string;
  width?: "full" | "half"; // New prop to control layout
}

const FileUploadGroup: React.FC<FileUploadGroupProps> = ({
  label,
  required = false,
  uploadedFiles,
  onFilesChange,
  accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx",
  maxFiles = 3,
  maxFileSize = 10,
  disabled = false,
  error,
  width = "full", // Default to full width (top/bottom layout)
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`;
    }
    return null;
  };

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    const validFiles: File[] = [];
    let errorMessage = "";

    for (const file of newFiles) {
      const validationError = validateFile(file);
      if (validationError) {
        errorMessage = validationError;
        break;
      }
      validFiles.push(file);
    }

    if (errorMessage) {
      setFileError(errorMessage);
      return;
    }

    const totalFiles = [...uploadedFiles, ...validFiles];
    if (totalFiles.length > maxFiles) {
      setFileError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setFileError("");
    onFilesChange(totalFiles);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    const updated = [...uploadedFiles];
    updated.splice(index, 1);
    onFilesChange(updated);
    setFileError("");
  };

  const openFileDialog = () => {
    if (inputRef.current && !disabled) {
      inputRef.current.click();
    }
  };

  const hasError = error || fileError;

  // Determine layout classes based on width prop
  const containerClasses =
    width === "full"
      ? "flex gap-4 flex-col md:flex-row"
      : "flex gap-4 flex-col";

  const uploadAreaClasses = width === "full" ? "flex-1" : "w-full";

  const filesAreaClasses = width === "full" ? "flex-1" : "w-full";

  return (
    <div className="space-y-3">
      <label className="flex items-center text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className={containerClasses}>
        {/* Upload area */}
        <div className={uploadAreaClasses}>
          <div
            className={`
              relative border-2 border-dashed rounded-lg p-4 transition-all duration-200
              ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
              ${hasError ? "border-red-300 bg-red-50" : ""}
              ${
                disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-gray-400 cursor-pointer"
              }
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              accept={accept}
              onChange={(e) => handleFileChange(e.target.files)}
              className="hidden"
              disabled={disabled}
            />

            <div className="flex items-center gap-3">
              <div
                className={`
                p-2 rounded-full transition-colors duration-200 flex-shrink-0
                ${dragActive ? "bg-blue-100" : "bg-gray-100"}
                ${hasError ? "bg-red-100" : ""}
              `}
              >
                <Upload
                  className={`
                  w-5 h-5 transition-colors duration-200
                  ${dragActive ? "text-blue-600" : "text-gray-400"}
                  ${hasError ? "text-red-500" : ""}
                `}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  {accept.replace(/\./g, "").toUpperCase()} files up to{" "}
                  {maxFileSize}MB
                </p>
                <p className="text-xs text-gray-400">
                  {uploadedFiles.length}/{maxFiles} files selected
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Uploaded files */}
        <div className={filesAreaClasses}>
          {uploadedFiles.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Uploaded Files
              </p>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="flex-shrink-0">
                        <File size={16} className="text-blue-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className="text-sm font-medium text-gray-900 truncate"
                          title={file.name}
                        >
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="flex-shrink-0 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg min-h-[80px]">
              <p className="text-sm text-gray-400">No files uploaded yet</p>
            </div>
          )}
        </div>
      </div>

      {hasError && (
        <div className="flex items-center gap-2 text-sm text-red-600  p-3 rounded-md">
          <AlertCircle size={16} />
          <span>{hasError}</span>
        </div>
      )}
    </div>
  );
};

export default FileUploadGroup;
