import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Paperclip } from "lucide-react";

interface MessageInputProps {
  input: string;
  setInput: (value: string) => void;
  onSendMessage: () => void;
  onFileUpload: () => void;
  isSendingMessage: boolean;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  input,
  setInput,
  onSendMessage,
  onFileUpload,
  isSendingMessage,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isSendingMessage) {
        onSendMessage();
      }
    }
  };

  return (
    <div className="p-4 border-t bg-gradient-to-r from-background to-muted/20 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        {/* File Upload Button */}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onFileUpload}
          disabled={disabled || isSendingMessage}
          className="flex-shrink-0 hover:bg-primary/10 transition-colors p-2 rounded-lg"
          title="Attach file"
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        {/* Message Input */}
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            disabled={disabled || isSendingMessage}
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
          onClick={onSendMessage}
          disabled={!input.trim() || isSendingMessage || disabled}
          className="flex-shrink-0 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Status Indicator */}
      {isSendingMessage && (
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
            <div className="w-1 h-1 bg-primary rounded-full animate-pulse delay-75" />
            <div className="w-1 h-1 bg-primary rounded-full animate-pulse delay-150" />
          </div>
          <span>Sending...</span>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
