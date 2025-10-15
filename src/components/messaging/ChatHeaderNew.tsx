import { Button } from "@/components/ui/button";
import { Phone, Video, MoreVertical, CaseUpper } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";

const ChatHeader: React.FC = () => {
  const { state } = useChat();
  const { rooms, activeRoomId, connectionStatus } = state;

  // Get active room
  const selectedRoom = rooms.find((room) => room.id === activeRoomId);

  if (!selectedRoom) {
    return null;
  }

  // Helper functions
  const getParticipantInfo = () => {
    const participant = selectedRoom.tourist || selectedRoom.provider;
    return {
      name: selectedRoom.tourist?.firstName
        ? `${selectedRoom.tourist.firstName} ${selectedRoom.tourist.lastName}`
        : selectedRoom.provider?.businessName || "Unknown",
      avatar: participant?.profilePictureUrl || null,
      country: selectedRoom.tourist?.country || null,
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

  const participantInfo = getParticipantInfo();

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <div className="relative">
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

          {/* Online status */}
          {/* <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div> */}
        </div>

        {/* User info */}
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">
            {participantInfo.name}
          </h3>
          <div className="flex items-center space-x-1">
            {/* {connectionStatus === "connected" ? (
              <span className="text-xs text-green-600 font-medium">Online</span>
            ) : (
              <span className="text-xs text-gray-500">
                {connectionStatus === "connecting"
                  ? "Connecting..."
                  : "Offline"}
              </span>
            )} */}

            {participantInfo.country && (
              <>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">
                  {participantInfo.country.toUpperCase()}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      {/* <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-blue-50"
          title="Voice call"
        >
          <Phone className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-blue-50"
          title="Video call"
        >
          <Video className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-blue-50"
          title="More options"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div> */}
    </div>
  );
};

export default ChatHeader;
