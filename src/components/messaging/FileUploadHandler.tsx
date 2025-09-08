import { useCallback, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useChat } from "@/contexts/ChatContext";
import { sendFileMessage } from "@/services/chatService";
import { useAuth } from "@/hooks/useAuth";
import FilePreviewModal from "./FilePreviewModal";

interface StagedFile {
  file: File;
  preview?: string;
  caption: string;
  type: 'image' | 'document' | 'file';
}

interface FileUploadHandlerProps {
  children: (props: {
    onFileUpload: () => void;
    isUploading: boolean;
    hasStagedFile: boolean;
  }) => React.ReactNode;
}

const FileUploadHandler: React.FC<FileUploadHandlerProps> = ({ children }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stagedFile, setStagedFile] = useState<StagedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { state } = useChat();
  const { user } = useAuth();
  const { activeRoomId } = state;

  const handleFileUpload = useCallback(() => {
    if (!activeRoomId) {
      toast({
        title: "Error",
        description: "No active chat room selected",
        variant: "destructive",
      });
      return;
    }

    fileInputRef.current?.click();
  }, [activeRoomId, toast]);

  const getFileType = (file: File): 'image' | 'document' | 'file' => {
    if (file.type.startsWith('image/')) {
      return 'image';
    }
    
    const documentTypes = [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];
    
    if (documentTypes.includes(file.type)) {
      return 'document';
    }
    
    return 'file';
  };

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !activeRoomId || !user) {
        return;
      }

      // File size check (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }

      // Supported file types
      const supportedTypes = [
        // Images
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/bmp",
        "image/svg+xml",
        // Documents
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        // Archives
        "application/zip",
        "application/x-zip-compressed",
        "application/x-rar-compressed",
        "application/x-7z-compressed",
      ];

      if (!supportedTypes.includes(file.type)) {
        toast({
          title: "Unsupported file type",
          description: "Please select a supported image, document, or archive file",
          variant: "destructive",
        });
        return;
      }

      const fileType = getFileType(file);
      const newStagedFile: StagedFile = {
        file,
        type: fileType,
        caption: "",
      };

      // Create preview for images
      if (fileType === 'image') {
        try {
          const reader = new FileReader();
          reader.onload = (e) => {
            setStagedFile({
              ...newStagedFile,
              preview: e.target?.result as string,
            });
          };
          reader.readAsDataURL(file);
        } catch (error) {
          console.warn("Could not create image preview:", error);
          setStagedFile(newStagedFile);
        }
      } else {
        setStagedFile(newStagedFile);
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [activeRoomId, user, toast]
  );

  const handleSendFile = useCallback(
    async (file: File, caption: string) => {
      if (!activeRoomId || !user) {
        return;
      }

      setIsUploading(true);
      
      try {
        const messageData = {
          messageType: file.type.startsWith("image/") ? "IMAGE" : "FILE",
          content: caption || file.name,
          caption: caption || undefined,
        };

        const response = await sendFileMessage(activeRoomId, messageData, file);

        if (response.success) {
          toast({
            title: "File sent",
            description: `${file.name} has been sent successfully`,
          });
          setStagedFile(null);
        } else {
          throw new Error(response.message || "Failed to send file");
        }
      } catch (error) {
        console.error("File upload error:", error);
        toast({
          title: "Upload failed",
          description: "Failed to upload file. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    },
    [activeRoomId, user, toast]
  );

  const handleCancel = useCallback(() => {
    setStagedFile(null);
    setIsUploading(false);
  }, []);

  return (
    <>
      {children({ 
        onFileUpload: handleFileUpload, 
        isUploading,
        hasStagedFile: !!stagedFile 
      })}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar,.7z,.xls,.xlsx,.ppt,.pptx"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      <FilePreviewModal
        stagedFile={stagedFile}
        onSend={handleSendFile}
        onCancel={handleCancel}
        isUploading={isUploading}
      />
    </>
  );
};

export default FileUploadHandler;
