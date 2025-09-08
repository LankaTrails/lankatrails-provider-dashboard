import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import type { DirectChatRoom } from "@/types/chatTypes";

interface ChatRoomListProps {
  isLoading: boolean;
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({ isLoading }) => {
  const { state, setActiveRoom } = useChat();
  const { rooms, activeRoomId } = state;

  // Helper functions
  const getParticipantInfo = (room: DirectChatRoom) => {
    // For providers, show tourist info
    const participant = room.tourist || room.provider;
    return {
      name: room.tourist?.firstName
        ? `${room.tourist.firstName} ${room.tourist.lastName}`
        : room.provider?.businessName || "Unknown",
      avatar: participant?.profilePictureUrl || null,
    };
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getLastMessage = () => {
    return "Start a conversation...";
  };

  if (isLoading) {
    return (
      <div className="w-full border-r bg-gradient-to-b from-background to-muted/30 flex flex-col min-h-0">
        <div className="p-4 border-b flex-shrink-0 bg-background/80 backdrop-blur-sm">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-3 w-[80px]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="w-full flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="font-medium text-gray-700 mb-2">
              No conversations yet
            </h3>
            <p className="text-sm text-gray-500 max-w-[200px]">
              Start chatting with tourists who book your services
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {rooms.map((room) => {
            const participantInfo = getParticipantInfo(room);
            const isSelected = room.id === activeRoomId;
            const lastMessage = getLastMessage();

            return (
              <div
                key={room.id}
                onClick={() => setActiveRoom(room.id)}
                className={`
                  flex items-center space-x-3 p-3 rounded-lg cursor-pointer
                  transition-all duration-200 hover:bg-blue-50/80
                  ${
                    isSelected
                      ? "bg-gradient-to-r from-blue-100 to-purple-100 shadow-sm border border-blue-200"
                      : "hover:shadow-sm"
                  }
                `}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {participantInfo.avatar ? (
                    <img
                      src={participantInfo.avatar}
                      alt={participantInfo.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm shadow-sm">
                      {getInitials(participantInfo.name)}
                    </div>
                  )}

                  {/* Online status indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate text-sm">
                      {participantInfo.name}
                    </h3>

                    {/* Unread count */}
                    {room.unreadCount && room.unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="ml-2 h-5 min-w-[20px] text-xs bg-gradient-to-r from-red-500 to-pink-500 border-0"
                      >
                        {room.unreadCount > 99 ? "99+" : room.unreadCount}
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {lastMessage}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatRoomList;
