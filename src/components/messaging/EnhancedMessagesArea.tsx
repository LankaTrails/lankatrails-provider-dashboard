import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/contexts/ChatContext";
import MessageDisplay from "./MessageDisplay";
import EmptyState from "./EmptyState";
import { Loader2, FileText, Image, File } from "lucide-react";

// Simple typing indicator component since TypingIndicator has import issues
const SimpleTypingIndicator: React.FC<{ typingUsers: any[] }> = ({
  typingUsers,
}) => {
  if (typingUsers.length === 0) return null;

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0].username} is typing...`;
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0].username} and ${typingUsers[1].username} are typing...`;
    } else {
      return `${typingUsers[0].username} and ${
        typingUsers.length - 1
      } others are typing...`;
    }
  };

  return (
    <div className="flex items-center space-x-2 px-4 py-2 animate-pulse">
      <div className="flex items-center space-x-1">
        <div className="flex space-x-1">
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "200ms" }}
          />
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "400ms" }}
          />
        </div>
        <span className="text-sm text-gray-500 ml-2">{getTypingText()}</span>
      </div>
    </div>
  );
};

const MessagesArea: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state } = useChat();
  const {
    messages,
    activeRoomId,
    rooms,
    typingUsers,
    isLoading,
    connectionStatus,
  } = state;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Get active room from rooms array
  const activeRoom = rooms.find((room) => room.id === activeRoomId);

  // Utility functions for MessageDisplay
  const getFullUrl = (path: string) => {
    if (path.startsWith("http")) return path;
    return `${import.meta.env.VITE_API_BASE_URL || "/api"}/files/${path}`;
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <Image className="h-4 w-4" />;
    }
    if (fileType.includes("pdf") || fileType.includes("document")) {
      return <FileText className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  const onNavigate = (path: string) => {
    navigate(path);
  };

  // Auto-scroll to bottom for new messages (only if user hasn't scrolled up)
  useEffect(() => {
    if (!isUserScrolling && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isUserScrolling]);

  // Handle scroll detection to prevent auto-scroll when user is viewing history
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 50; // 50px threshold
      setIsUserScrolling(!isAtBottom);
    }
  };

  // Reset scroll detection when switching rooms
  useEffect(() => {
    setIsUserScrolling(false);
  }, [activeRoomId]);

  if (!activeRoom) {
    return <EmptyState />;
  }

  const roomMessages = messages[activeRoom.id!] || [];
  const currentTypingUsers = typingUsers[activeRoom.id!] || [];

  // Filter out current user from typing indicators
  const otherUsersTyping = currentTypingUsers.filter((typingUser) => {
    return typingUser.userId !== user?.id;
  });
  if (isLoading && roomMessages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-500" />
          <p className="text-sm text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50 relative min-h-0">
      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-2 space-y-3 max-h-full"
        style={{ height: "100%", overflowY: "auto" }}
      >
        {roomMessages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="font-medium text-gray-700 mb-2">
                Start the conversation
              </h3>
              <p className="text-sm text-gray-500">
                Send a message to{" "}
                {activeRoom.tourist?.firstName ||
                  activeRoom.provider?.businessName ||
                  "this contact"}
              </p>
            </div>
          </div>
        ) : (
          <>
            {roomMessages.map((message) => (
              <MessageDisplay
                key={message.id}
                message={message}
                isOwnMessage={message.senderId === user?.id}
                getFullUrl={getFullUrl}
                getFileIcon={getFileIcon}
                onNavigate={onNavigate}
              />
            ))}

            {/* Typing Indicator */}
            {otherUsersTyping.length > 0 && (
              <SimpleTypingIndicator typingUsers={otherUsersTyping} />
            )}
          </>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Connection Status Overlay */}
      {connectionStatus !== "connected" && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center p-6 bg-white rounded-lg shadow-md border">
            {connectionStatus === "connecting" ||
            connectionStatus === "reconnecting" ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-500" />
                <p className="text-sm text-gray-600">
                  {connectionStatus === "connecting"
                    ? "Connecting..."
                    : "Reconnecting..."}
                </p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">⚠️</span>
                </div>
                <p className="text-sm text-gray-600">Chat is offline</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Scroll to bottom button */}
      {isUserScrolling && roomMessages.length > 0 && (
        <button
          onClick={() => {
            setIsUserScrolling(false);
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
          className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-all duration-200 z-20"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default MessagesArea;
