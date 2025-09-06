import { Badge } from "@/components/ui/badge";
import type { DirectChatRoom } from "@/types/chatTypes";

interface ChatHeaderProps {
  selectedRoom: DirectChatRoom;
  getParticipantInfo: (room: DirectChatRoom) => {
    name: string;
    avatar: string | null;
  };
  getInitials: (name: string) => string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedRoom,
  getParticipantInfo,
  getInitials,
}) => {
  const participantInfo = getParticipantInfo(selectedRoom);

  return (
    <div className="p-4 border-b bg-gradient-to-r from-background to-muted/20 backdrop-blur-sm flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center text-sm font-medium shadow-md">
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

          {/* Online Status */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h4 className="font-semibold text-sm truncate text-foreground">
            {participantInfo.name}
          </h4>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="text-xs px-2 py-0.5 rounded-full"
            >
              Tourist
            </Badge>
            <span className="text-xs text-green-600 font-medium">● Online</span>
          </div>
        </div>

        {/* Additional Actions (Future) */}
        <div className="flex items-center gap-2">
          {/* Could add more options like video call, phone, etc. */}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
