import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Image, FileText, File } from "lucide-react";

interface StagedFile {
  file: File;
  preview?: string;
  caption: string;
  type: "image" | "document" | "file";
}

interface FilePreviewModalProps {
  stagedFile: StagedFile | null;
  onSend: (file: File, caption: string) => void;
  onCancel: () => void;
  isUploading: boolean;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  stagedFile,
  onSend,
  onCancel,
  isUploading,
}) => {
  const [caption, setCaption] = useState("");

  if (!stagedFile) return null;

  const handleSend = () => {
    onSend(stagedFile.file, caption);
  };

  const getFileIcon = () => {
    switch (stagedFile.type) {
      case "image":
        return <Image className="h-8 w-8 text-blue-500" />;
      case "document":
        return <FileText className="h-8 w-8 text-green-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              📎
            </div>
            Send File
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isUploading}
            className="h-10 w-10 p-0 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </Button>
        </div>

        {/* File Preview */}
        <div className="p-6 space-y-5 max-h-[calc(85vh-140px)] overflow-y-auto">
          {/* Image Preview */}
          {stagedFile.type === "image" && stagedFile.preview && (
            <div className="relative rounded-xl overflow-hidden bg-gray-50">
              <img
                src={stagedFile.preview}
                alt="File preview"
                className="w-full h-56 object-cover"
              />
              <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                Preview
              </div>
            </div>
          )}

          {/* File Info for non-images */}
          {stagedFile.type !== "image" && (
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
              <div className="flex-shrink-0">{getFileIcon()}</div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-medium text-gray-900 truncate">
                  {stagedFile.file.name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {formatFileSize(stagedFile.file.size)} •{" "}
                  {stagedFile.file.type.split("/")[1]?.toUpperCase() || "File"}
                </p>
              </div>
            </div>
          )}

          {/* Caption Input */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              💬 Caption (optional)
            </label>
            <div className="relative">
              <Input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption to your file..."
                disabled={isUploading}
                className="w-full pr-16 py-3 text-base border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-lg transition-all"
                maxLength={200}
              />
              {caption.length > 0 && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span
                    className={`text-xs font-medium ${
                      caption.length > 180 ? "text-red-500" : "text-gray-400"
                    }`}
                  >
                    {caption.length}/200
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* File Details - Compact */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">File name:</span>
              <span className="font-medium text-gray-800 truncate ml-2 max-w-[200px]">
                {stagedFile.file.name}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Size:</span>
              <span className="font-medium text-gray-800">
                {formatFileSize(stagedFile.file.size)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Type:</span>
              <span className="font-medium text-gray-800">
                {stagedFile.file.type || "Unknown"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50/50">
          <div className="text-xs text-gray-500">
            {isUploading ? "Uploading..." : "Ready to send"}
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isUploading}
              className="px-6 py-2 border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={isUploading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send File</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
