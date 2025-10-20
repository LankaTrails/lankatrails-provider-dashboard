import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Download, FileText, FileImage, AlertCircle } from "lucide-react";

interface DocumentViewerProps {
  url: string;
  title: string;
  triggerButton?: React.ReactNode;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  url,
  title,
  triggerButton,
}) => {
  const [imageError, setImageError] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to ensure file URLs have the correct base path
  const getFileUrl = (url: string): string => {
    if (!url) return "";

    // If it's already a full URL, return as is
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // Use VITE_BASE_URL as the primary base URL for documents
    const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:8080";

    console.log("🔗 Building file URL:", {
      originalUrl: url,
      baseUrl,
      finalUrl: `${baseUrl}${url}`,
    });

    // Construct the full URL in the format: http://localhost:8080/path/to/file
    return `${baseUrl}${url}`;
  };

  const getFileIcon = (url: string) => {
    if (!url) return <FileText className="w-5 h-5 text-gray-500" />;

    const extension = url.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="w-5 h-5 text-blue-500" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
        return <FileImage className="w-5 h-5 text-green-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const fullUrl = getFileUrl(url);
  const extension = fullUrl.split(".").pop()?.toLowerCase();
  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(
    extension || ""
  );
  const isPdf = extension === "pdf";

  // Debug logging
  console.log("DocumentViewer Debug:", {
    originalUrl: url,
    fullUrl,
    extension,
    isImage,
    isPdf,
  });

  // Reset error states when URL changes
  useEffect(() => {
    setImageError(false);
    setPdfError(false);
    setIsLoading(true);
  }, [fullUrl]);

  const defaultTriggerButton = (
    <Button variant="outline" size="sm" className="flex items-center gap-2">
      <Eye className="w-4 h-4" />
      View Document
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {triggerButton || defaultTriggerButton}
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="flex items-center gap-2">
            {getFileIcon(fullUrl)}
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden bg-white relative mx-6 mb-6">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <span className="ml-2 text-sm text-gray-600">
                Loading document...
              </span>
            </div>
          )}

          {isImage ? (
            <div className="w-full h-full flex items-center justify-center">
              {!imageError ? (
                <img
                  src={fullUrl}
                  alt={title}
                  className="max-w-full max-h-full object-contain border rounded"
                  onLoad={() => {
                    console.log("Image loaded successfully:", fullUrl);
                    setIsLoading(false);
                  }}
                  onError={() => {
                    console.error("Image failed to load:", fullUrl);
                    setImageError(true);
                    setIsLoading(false);
                  }}
                />
              ) : (
                <div className="text-center p-8">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 font-medium">
                    Failed to load image
                  </p>
                  <p className="text-sm text-gray-500 mt-2 break-all">
                    {fullUrl}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => window.open(fullUrl, "_blank")}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download File
                  </Button>
                </div>
              )}
            </div>
          ) : isPdf ? (
            <div className="w-full h-full">
              {!pdfError ? (
                <iframe
                  src={fullUrl}
                  className="w-full h-full border-0 rounded"
                  title={title}
                  onLoad={() => {
                    console.log("PDF loaded successfully:", fullUrl);
                    setIsLoading(false);
                  }}
                  onError={() => {
                    console.error("PDF failed to load:", fullUrl);
                    setPdfError(true);
                    setIsLoading(false);
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 font-medium">
                      Failed to load PDF
                    </p>
                    <p className="text-sm text-gray-500 mt-2 break-all">
                      {fullUrl}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => window.open(fullUrl, "_blank")}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Open in New Tab
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(fullUrl, "_blank")}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
              <div className="text-center">
                {getFileIcon(fullUrl)}
                <p className="mt-2 text-sm text-gray-600">
                  This document type cannot be previewed directly.
                </p>
                <p className="mt-1 text-xs text-gray-500 font-mono break-all">
                  {fullUrl}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    window.open(fullUrl, "_blank");
                    setIsLoading(false);
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download to View
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;
