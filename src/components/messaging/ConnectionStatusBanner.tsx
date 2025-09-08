import { AlertCircle, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useChat } from "@/contexts/ChatContext";
import type { ConnectionStatus } from "@/types/chatTypes";

const ConnectionStatusBanner: React.FC = () => {
  const { state, connect } = useChat();
  const { connectionStatus } = state;

  if (connectionStatus === "connected") {
    return null; // Don't show anything when connected
  }

  const getStatusConfig = (status: ConnectionStatus) => {
    switch (status) {
      case "connecting":
        return {
          icon: <RefreshCw className="h-4 w-4 animate-spin" />,
          title: "Connecting",
          description: "Establishing connection to chat server...",
          variant: "default" as const,
          showRetry: false,
        };

      case "reconnecting":
        return {
          icon: <RefreshCw className="h-4 w-4 animate-spin" />,
          title: "Reconnecting",
          description: "Connection lost. Attempting to reconnect...",
          variant: "default" as const,
          showRetry: false,
        };

      case "disconnected":
        return {
          icon: <WifiOff className="h-4 w-4" />,
          title: "Disconnected",
          description: "Chat is offline. Click to reconnect.",
          variant: "destructive" as const,
          showRetry: true,
        };

      case "error":
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          title: "Connection Error",
          description:
            "Failed to connect to chat server. Check your internet connection.",
          variant: "destructive" as const,
          showRetry: true,
        };

      default:
        return {
          icon: <WifiOff className="h-4 w-4" />,
          title: "Unknown Status",
          description: "Chat connection status unknown.",
          variant: "destructive" as const,
          showRetry: true,
        };
    }
  };

  const config = getStatusConfig(connectionStatus);

  return (
    <Alert variant={config.variant} className="mb-4 border-l-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {config.icon}
          <div>
            <div className="font-medium text-sm">{config.title}</div>
            <AlertDescription className="text-xs">
              {config.description}
            </AlertDescription>
          </div>
        </div>

        {config.showRetry && (
          <Button
            size="sm"
            variant="outline"
            onClick={connect}
            className="ml-4 hover:bg-primary/10"
          >
            <Wifi className="h-3 w-3 mr-1" />
            Retry
          </Button>
        )}
      </div>
    </Alert>
  );
};

export default ConnectionStatusBanner;
