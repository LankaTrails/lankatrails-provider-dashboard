import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { ChatProvider, useChat } from "@/contexts/ChatContext";
import ChatRoomListNew from "./messaging/ChatRoomListNew";
import MessageInputWithTyping from "./messaging/MessageInputWithTyping";
import ChatHeaderNew from "./messaging/ChatHeaderNew";
import EnhancedMessagesArea from "./messaging/EnhancedMessagesArea";
import EmptyState from "./messaging/EmptyState";
import ConnectionStatusBanner from "./messaging/ConnectionStatusBanner";

const MessagingPlatformContent = () => {
  const { user } = useAuth();
  const { state, loadRooms } = useChat();
  const { rooms, activeRoomId, isLoading } = state;

  // Load chat rooms on component mount
  useEffect(() => {
    if (user) {
      loadRooms();
    }
  }, [user, loadRooms]);

  // Get active room
  const activeRoom = rooms.find((room) => room.id === activeRoomId);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Connection Status */}
      <ConnectionStatusBanner />

      {/* Main Chat Interface */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Rooms Sidebar */}
        <div className="w-80 border-r border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">💬</span>
                </div>
                Messages
              </h2>
            </div>

            {/* Chat Rooms List */}
            <div className="flex-1 overflow-hidden">
              <ChatRoomListNew isLoading={isLoading} />
            </div>
          </div>
        </div>

        {/* Chat Content Area */}
        <div className="flex-1 flex flex-col">
          {activeRoom ? (
            <>
              {/* Chat Header */}
              <ChatHeaderNew />

              {/* Messages Area */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <EnhancedMessagesArea />
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 bg-white/90 backdrop-blur-sm">
                <MessageInputWithTyping />
              </div>
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
};

const MessagingPlatform = () => {
  return (
    <ChatProvider>
      <Card className="h-[600px] w-full shadow-xl border-0 bg-transparent overflow-hidden">
        <MessagingPlatformContent />
      </Card>
    </ChatProvider>
  );
};

export default MessagingPlatform;
