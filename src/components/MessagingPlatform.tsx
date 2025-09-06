import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { FileText, FileImage, FileType, MessageCircle } from "lucide-react";
import type { DirectChatRoom, ChatMessage } from "@/types/chatTypes";
import {
  getMyChatRooms,
  getRoomMessages,
  sendFileMessage,
  markAllMessagesAsRead,
} from "@/services/chatService";
import { useAuth } from "@/hooks/useAuth";
import ChatRoomList from "./messaging/ChatRoomList";
import MessageInput from "./messaging/MessageInput";
import ChatHeader from "./messaging/ChatHeader";
import MessagesArea from "./messaging/MessagesArea";
import EmptyState from "./messaging/EmptyState";

const MessagingPlatform = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState<DirectChatRoom[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function to get full URL with VITE_BASE_URL
  const getFullUrl = (path: string) => {
    const baseUrl = import.meta.env.VITE_BASE_URL || "";
    return path.startsWith("http") ? path : `${baseUrl}${path}`;
  };

  // Helper function to get file icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <FileImage className="h-4 w-4" />;
    if (fileType.includes("pdf")) return <FileType className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  // Load chat rooms on component mount
  useEffect(() => {
    loadChatRooms();
  }, []);

  // Load messages when room is selected
  useEffect(() => {
    if (selectedRoomId) {
      loadMessages(selectedRoomId);
      markAllMessagesAsRead(selectedRoomId).catch(console.error);
    }
  }, [selectedRoomId]);

  const loadChatRooms = async () => {
    try {
      setIsLoading(true);
      const response = await getMyChatRooms();

      if (response.success && response.data) {
        setChatRooms(response.data);
        // Auto-select first room if available
        if (response.data.length > 0 && !selectedRoomId) {
          setSelectedRoomId(response.data[0].id);
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to load chat rooms",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading chat rooms:", error);
      toast({
        title: "Error",
        description: "Failed to load chat rooms",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (roomId: number) => {
    try {
      setIsLoadingMessages(true);
      const response = await getRoomMessages(roomId);

      if (response.success && response.data) {
        setMessages(response.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const sendTextMessage = async () => {
    if (!selectedRoomId || !input.trim() || isSendingMessage) return;

    try {
      setIsSendingMessage(true);
      // Implementation would depend on your sendTextMessage API
      // For now, we'll just add the message optimistically
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        chatRoomId: selectedRoomId,
        senderId: user?.id || 0,
        messageType: "TEXT",
        content: input.trim(),
        sentAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setInput("");

      toast({
        title: "Message sent",
        description: "Your message has been sent successfully",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!selectedRoomId || !file || !user) return;

    try {
      setIsSendingMessage(true);

      // Create a new file message
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        chatRoomId: selectedRoomId,
        senderId: user.id,
        messageType: "FILE",
        content: file.name,
        sentAt: new Date().toISOString(),
        files: {
          id: Date.now().toString(),
          fileName: file.name,
          fileType: file.type,
          fileUrl: URL.createObjectURL(file), // Temporary URL for preview
        },
      };

      await sendFileMessage(selectedRoomId, newMessage, file);

      // Add message to local state
      setMessages((prev) => [...prev, newMessage]);

      toast({
        title: "File sent",
        description: "Your file has been sent successfully",
      });
    } catch (error) {
      console.error("Error sending file:", error);
      toast({
        title: "Error",
        description: "Failed to send file",
        variant: "destructive",
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  const getParticipantInfo = (room: DirectChatRoom) => {
    if (!user) return { name: "Unknown", avatar: null };

    const isProvider = room.providerId === user.id;
    const participant = isProvider ? room.tourist : room.provider;

    if (!participant) return { name: "Unknown", avatar: null };

    if ("businessName" in participant) {
      return {
        name: participant.businessName,
        avatar: participant.profilePictureUrl,
      };
    } else {
      return {
        name: `${participant.firstName} ${participant.lastName}`,
        avatar: participant.profilePictureUrl,
      };
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getLastMessage = () => {
    // This would typically come from the room data
    // For now, return a placeholder
    return "Click to start conversation";
  };

  const selectedRoom = chatRooms.find((room) => room.id === selectedRoomId);

  // Loading state
  if (isLoading) {
    return (
      <Card className="rounded-xl border bg-card text-card-foreground shadow-lg h-[36rem] flex flex-col overflow-hidden">
        <div className="flex flex-1 min-h-0">
          <div className="w-64 border-r bg-gradient-to-b from-background to-muted/30 p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
              <p className="text-muted-foreground">Loading conversations...</p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl border bg-card text-card-foreground shadow-lg h-[36rem] flex flex-col overflow-hidden backdrop-blur-sm">
      <div className="flex flex-1 min-h-0">
        {/* Chat rooms list */}
        <ChatRoomList
          chatRooms={chatRooms}
          selectedRoomId={selectedRoomId}
          isLoading={isLoading}
          onRoomSelect={setSelectedRoomId}
          getParticipantInfo={getParticipantInfo}
          getInitials={getInitials}
          getLastMessage={getLastMessage}
        />

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-gradient-to-b from-background/50 to-muted/10">
          {selectedRoom ? (
            <>
              {/* Chat header */}
              <ChatHeader
                selectedRoom={selectedRoom}
                getParticipantInfo={getParticipantInfo}
                getInitials={getInitials}
              />

              {/* Messages area */}
              <MessagesArea
                messages={messages}
                isLoadingMessages={isLoadingMessages}
                userId={user?.id}
                getFullUrl={getFullUrl}
                getFileIcon={getFileIcon}
                onNavigate={navigate}
              />

              {/* Message input */}
              <MessageInput
                input={input}
                setInput={setInput}
                onSendMessage={sendTextMessage}
                onFileUpload={() => fileInputRef.current?.click()}
                isSendingMessage={isSendingMessage}
              />

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(file);
                    e.target.value = ""; // Reset input
                  }
                }}
              />
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </Card>
  );
};

export default MessagingPlatform;
