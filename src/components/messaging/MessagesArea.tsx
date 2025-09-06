import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle } from "lucide-react";
import MessageDisplay from "./MessageDisplay";
import type { ChatMessage } from "@/types/chatTypes";

interface MessagesAreaProps {
  messages: ChatMessage[];
  isLoadingMessages: boolean;
  userId: number | undefined;
  getFullUrl: (path: string) => string;
  getFileIcon: (fileType: string) => JSX.Element;
  onNavigate: (path: string) => void;
}

const MessagesArea: React.FC<MessagesAreaProps> = ({
  messages,
  isLoadingMessages,
  userId,
  getFullUrl,
  getFileIcon,
  onNavigate,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isLoadingMessages) {
    return (
      <div className="flex-1 overflow-y-auto min-h-0 p-4 bg-gradient-to-b from-background to-muted/20">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`flex ${
                i % 2 === 0 ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex items-start gap-3 max-w-[70%]">
                {i % 2 !== 0 && (
                  <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                )}
                <div className="space-y-2">
                  <Skeleton className="h-16 w-48 rounded-2xl" />
                  <Skeleton className="h-3 w-20" />
                </div>
                {i % 2 === 0 && (
                  <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <div className="text-center space-y-4 p-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto">
            <MessageCircle className="h-8 w-8 text-primary/60" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 text-foreground">
              No messages yet
            </h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              Start the conversation by sending your first message. Break the
              ice and introduce yourself!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto min-h-0 p-4 bg-gradient-to-b from-background to-muted/20">
      <div className="space-y-1 pb-4">
        {messages.map((message, index) => {
          const prevMessage = messages[index - 1];
          const showDate =
            !prevMessage ||
            new Date(message.sentAt).toDateString() !==
              new Date(prevMessage.sentAt).toDateString();

          return (
            <div key={message.id || index}>
              {/* Date Separator */}
              {showDate && (
                <div className="text-center my-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border/30" />
                    </div>
                    <div className="relative flex justify-center">
                      <Badge
                        variant="outline"
                        className="text-xs px-3 py-1 bg-background/80 backdrop-blur-sm border-border/50"
                      >
                        {new Date(message.sentAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Message */}
              <MessageDisplay
                message={message}
                isOwnMessage={message.senderId === userId}
                getFullUrl={getFullUrl}
                getFileIcon={getFileIcon}
                onNavigate={onNavigate}
              />
            </div>
          );
        })}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessagesArea;
