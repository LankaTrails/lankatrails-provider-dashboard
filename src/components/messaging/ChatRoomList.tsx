import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle } from "lucide-react";
import type { DirectChatRoom } from "@/types/chatTypes";

interface ChatRoomListProps {
  chatRooms: DirectChatRoom[];
  selectedRoomId: number | null;
  isLoading: boolean;
  onRoomSelect: (roomId: number) => void;
  getParticipantInfo: (room: DirectChatRoom) => {
    name: string;
    avatar: string | null;
  };
  getInitials: (name: string) => string;
  getLastMessage: () => string;
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({
  chatRooms,
  selectedRoomId,
  isLoading,
  onRoomSelect,
  getParticipantInfo,
  getInitials,
  getLastMessage,
}) => {
  if (isLoading) {
    return (
      <div className="w-64 border-r bg-gradient-to-b from-background to-muted/30 flex flex-col min-h-0">
        <div className="p-4 border-b flex-shrink-0 bg-background/80 backdrop-blur-sm">
          <h3 className="font-semibold text-sm">Messages</h3>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-4">
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
      </div>
    );
  }

  return (
    <div className="w-64 border-r bg-gradient-to-b from-background to-muted/30 flex flex-col min-h-0 shadow-sm">
      <div className="p-4 border-b flex-shrink-0 bg-background/80 backdrop-blur-sm">
        <h3 className="font-semibold text-sm text-foreground">Messages</h3>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        {chatRooms.length === 0 ? (
          <div className="p-6 text-center">
            <MessageCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">
              No conversations yet
            </p>
            <p className="text-xs text-muted-foreground/80 mt-1">
              Start chatting when you receive your first message
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {chatRooms.map((room) => {
              const participantInfo = getParticipantInfo(room);
              const isSelected = room.id === selectedRoomId;
              const hasUnread = room.unreadCount && room.unreadCount > 0;

              return (
                <button
                  key={room.id}
                  onClick={() => onRoomSelect(room.id!)}
                  className={`w-full text-left px-4 py-4 flex items-center gap-3 focus:outline-none transition-all duration-200 relative group ${
                    isSelected
                      ? "bg-gradient-to-r from-primary/15 to-primary/5 border-l-2 border-l-primary shadow-sm"
                      : "hover:bg-muted/60 hover:shadow-sm"
                  }`}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary" />
                  )}

                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center text-sm font-medium shadow-md">
                      {participantInfo.avatar ? (
                        <img
                          src={participantInfo.avatar}
                          alt={participantInfo.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        getInitials(participantInfo.name)
                      )}
                    </div>

                    {/* Online Status Indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-hidden min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium truncate text-sm text-foreground">
                        {participantInfo.name}
                      </p>
                      {hasUnread && (
                        <Badge
                          variant="destructive"
                          className="text-xs px-1.5 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center font-medium"
                        >
                          {room.unreadCount! > 99 ? "99+" : room.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate leading-relaxed">
                      {getLastMessage()}
                    </p>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoomList;
