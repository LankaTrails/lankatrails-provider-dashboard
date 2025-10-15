import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Paperclip } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import FileUploadHandler from "./FileUploadHandler";

interface MessageInputWithTypingProps {
  disabled?: boolean;
}

const MessageInputWithTyping: React.FC<MessageInputWithTypingProps> = ({
  disabled = false,
}) => {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { sendMessage, startTyping, stopTyping, state } = useChat();

  // Auto-stop typing after 3 seconds of inactivity
  const handleTypingTimeout = useCallback(() => {
    if (isTyping) {
      setIsTyping(false);
      stopTyping();
    }
  }, [isTyping, stopTyping]);

  const handleInputChange = useCallback(
    (value: string) => {
      setInput(value);

      // Start typing if not already typing
      if (!isTyping && value.trim()) {
        setIsTyping(true);
        startTyping();
      }

      // Reset typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (value.trim()) {
        typingTimeoutRef.current = setTimeout(handleTypingTimeout, 3000);
      } else if (isTyping) {
        // Stop typing immediately if input is empty
        setIsTyping(false);
        stopTyping();
      }
    },
    [isTyping, startTyping, handleTypingTimeout]
  );

  const handleSendMessage = useCallback(() => {
    if (!input.trim() || state.connectionStatus !== "connected") return;

    // Stop typing and send message
    if (isTyping) {
      setIsTyping(false);
      stopTyping();
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    sendMessage({
      messageType: "TEXT",
      content: input.trim(),
    });

    setInput("");
  }, [input, isTyping, state.connectionStatus, sendMessage, stopTyping]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTyping) {
        stopTyping();
      }
    };
  }, [isTyping, stopTyping]);

  // Stop typing when component unmounts or room changes
  useEffect(() => {
    return () => {
      if (isTyping) {
        setIsTyping(false);
        stopTyping();
      }
    };
  }, [state.activeRoomId, isTyping, stopTyping]);

  const isDisabled = disabled || state.connectionStatus !== "connected";

  return (
    <FileUploadHandler>
      {({ onFileUpload, isUploading, hasStagedFile }) => (
        <div className="p-4 border-t bg-gradient-to-r from-background to-muted/20 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            {/* File Upload Button */}
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={onFileUpload}
              disabled={isDisabled || isUploading || hasStagedFile}
              className={`flex-shrink-0 transition-colors p-2 rounded-lg ${
                hasStagedFile
                  ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  : "hover:bg-primary/10"
              }`}
              title={hasStagedFile ? "File ready to send" : "Attach file"}
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            {/* Message Input */}
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={
                  state.connectionStatus === "connected"
                    ? "Type a message..."
                    : "Connecting..."
                }
                disabled={isDisabled}
                className="pr-12 rounded-xl border-border/50 bg-background/80 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
              />

              {/* Character Count Indicator */}
              {input.length > 100 && (
                <div className="absolute -top-6 right-0 text-xs text-muted-foreground">
                  {input.length}/1000
                </div>
              )}
            </div>

            {/* Send Button */}
            <Button
              type="submit"
              onClick={handleSendMessage}
              disabled={
                !input.trim() || isDisabled || isUploading || hasStagedFile
              }
              className="flex-shrink-0 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* File staged indicator */}
          {hasStagedFile && (
            <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-blue-700">
                  📎 File ready to send
                </span>
              </div>
              <div className="text-xs text-blue-600 ml-auto">
                Click to preview and edit
              </div>
            </div>
          )}

          {/* Connection Status */}
          {state.connectionStatus !== "connected" && (
            <div className="flex items-center gap-2 mt-2 text-xs">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-orange-500 rounded-full animate-pulse" />
                <div className="w-1 h-1 bg-orange-500 rounded-full animate-pulse delay-75" />
                <div className="w-1 h-1 bg-orange-500 rounded-full animate-pulse delay-150" />
              </div>
              <span className="text-muted-foreground capitalize">
                {state.connectionStatus}...
              </span>
            </div>
          )}

          {/* Upload Status */}
          {isUploading && (
            <div className="flex items-center gap-2 mt-2 text-xs text-blue-600">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse delay-75" />
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse delay-150" />
              </div>
              <span>Uploading file...</span>
            </div>
          )}

          {/* Typing Indicator for Self (debug) */}
          {isTyping && process.env.NODE_ENV === "development" && (
            <div className="mt-2 text-xs text-blue-600">You are typing...</div>
          )}
        </div>
      )}
    </FileUploadHandler>
  );
};

export default MessageInputWithTyping;
