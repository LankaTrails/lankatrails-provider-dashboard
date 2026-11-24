import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCheck,
  Check,
  Download,
  Eye,
  Star,
  MapPin,
  DollarSign,
} from "lucide-react";
import type { ChatMessage } from "@/types/chatTypes";

interface MessageDisplayProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  showTimestamp?: boolean;
  getFullUrl: (path: string) => string;
  getFileIcon: (fileType: string) => JSX.Element;
  onNavigate: (path: string) => void;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({
  message,
  isOwnMessage,
  showTimestamp = true,
  getFullUrl,
  getFileIcon,
  onNavigate,
}) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const renderMessageContent = () => {
    switch (message.messageType) {
      case "TEXT":
        return <p className="break-words leading-relaxed">{message.content}</p>;

      case "IMAGE":
        return (
          <div className="space-y-3">
            {message.files?.fileUrl && (
              <div className="relative group">
                <img
                  src={getFullUrl(message.files.fileUrl)}
                  alt={message.files.fileName || "Image"}
                  className="max-w-xs rounded-xl cursor-pointer transition-all duration-200 group-hover:opacity-95 group-hover:scale-[1.02] shadow-sm"
                  onClick={() =>
                    window.open(
                      getFullUrl(message.files?.fileUrl || ""),
                      "_blank"
                    )
                  }
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black/30 rounded-xl backdrop-blur-sm">
                  <div className="bg-white/20 rounded-full p-3 backdrop-blur-sm">
                    <Eye className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            )}
            {message.content && (
              <p className="break-words text-sm italic text-muted-foreground leading-relaxed">
                {message.content}
              </p>
            )}
          </div>
        );

      case "FILE":
        return (
          <div className="space-y-2">
            {message.files && (
              <div className="flex items-center gap-3 p-4 border rounded-xl bg-gradient-to-r from-background to-muted/20 max-w-sm hover:shadow-md transition-all duration-200 border-border/50">
                <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                  {getFileIcon(message.files.fileType)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {message.files.fileName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {message.files.fileType}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      window.open(getFullUrl(message.files!.fileUrl), "_blank")
                    }
                    className="h-8 w-8 p-0 hover:bg-primary/10 transition-colors"
                    title="View file"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      try {
                        const response = await fetch(
                          getFullUrl(message.files!.fileUrl)
                        );
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = message.files!.fileName;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(url);
                      } catch (error) {
                        console.error("Download failed:", error);
                        const link = document.createElement("a");
                        link.href = getFullUrl(message.files!.fileUrl);
                        link.download = message.files!.fileName;
                        link.target = "_blank";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }
                    }}
                    className="h-8 w-8 p-0 hover:bg-primary/10 transition-colors"
                    title="Download file"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
            {message.content && (
              <p className="break-words text-sm leading-relaxed">
                {message.content}
              </p>
            )}
          </div>
        );

      case "SERVICE_CARD":
        return (
          <div className="space-y-3">
            {message.serviceCard && (
              <div className="border rounded-xl overflow-hidden bg-gradient-to-br from-background to-muted/20 max-w-sm hover:shadow-lg transition-all duration-300 border-border/50">
                {/* Service Image */}
                {message.serviceCard.mainImageUrl && (
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={getFullUrl(message.serviceCard.mainImageUrl)}
                      alt={message.serviceCard.serviceName || "Service"}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                )}

                <div className="p-4 space-y-3">
                  {/* Service Info */}
                  <div>
                    <h4 className="font-semibold text-sm leading-tight line-clamp-2">
                      {message.serviceCard.serviceName || "Service"}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                      {message.serviceCard.category || "Service"}
                    </p>
                  </div>

                  {/* Location & Price */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate max-w-[120px]">
                        {message.serviceCard.locations?.[0]?.formattedAddress ||
                          "Location"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-primary">
                      <DollarSign className="h-3 w-3" />
                      <span>
                        ${message.serviceCard.prices?.[0]?.amount || "0"}
                      </span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">4.8</span>
                      <span className="text-muted-foreground">
                        (24 reviews)
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t border-border/50">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full h-8 text-xs hover:bg-primary/10 transition-colors border-primary/20"
                      onClick={() => {
                        onNavigate(
                          `/services/${message.serviceCard!.serviceId}`
                        );
                      }}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {message.content && (
              <p className="break-words text-sm mt-2 leading-relaxed">
                {message.content}
              </p>
            )}
          </div>
        );

      case "SYSTEM":
        return (
          <div className="text-center">
            <Badge
              variant="secondary"
              className="text-xs px-3 py-1 rounded-full"
            >
              {message.content}
            </Badge>
          </div>
        );

      default:
        return <p className="break-words leading-relaxed">{message.content}</p>;
    }
  };

  return (
    <div
      className={`flex ${
        isOwnMessage ? "justify-end" : "justify-start"
      } mb-4 group`}
    >
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 transition-all duration-200 ${
          isOwnMessage
            ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
            : "bg-gradient-to-br from-background to-muted/50 border border-border/50 shadow-sm"
        } ${
          message.messageType === "SYSTEM"
            ? "bg-transparent shadow-none border-none px-2 py-1"
            : ""
        }`}
      >
        {renderMessageContent()}
        {showTimestamp && message.messageType !== "SYSTEM" && (
          <div
            className={`flex items-center justify-between gap-2 mt-2 pt-2 border-t text-xs opacity-70 ${
              isOwnMessage
                ? "border-primary-foreground/20 text-primary-foreground"
                : "border-border/30 text-muted-foreground"
            }`}
          >
            <span>{formatTime(message.sentAt)}</span>
            {isOwnMessage && (
              <div className="flex">
                {message.readBy && Object.keys(message.readBy).length > 0 ? (
                  <CheckCheck className="h-3 w-3" />
                ) : (
                  <Check className="h-3 w-3" />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageDisplay;
