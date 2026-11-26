import { useRef, useCallback, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import type { StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getCurrentToken } from "@/services/tokenService";
import { WS_URL } from "@/lib/config";
import type {
  ChatMessage,
  ConnectionStatus,
  WebSocketError,
  TypingEvent,
  ReadReceiptPayload,
  OutgoingMessage,
} from "@/types/chatTypes";

interface UseWebSocketProps {
  onMessageReceived: (message: ChatMessage) => void;
  onTypingEvent: (event: TypingEvent) => void;
  onError: (error: WebSocketError) => void;
  onConnectionStatusChange: (status: ConnectionStatus) => void;
}

interface UseWebSocketReturn {
  connectionStatus: ConnectionStatus;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (message: OutgoingMessage) => void;
  startTyping: (roomId: number) => void;
  stopTyping: (roomId: number) => void;
  markAsRead: (payload: ReadReceiptPayload) => void;
  subscribeToRoom: (roomId: number) => () => void;
  unsubscribeFromRoom: (roomId: number) => void;
}

export const useWebSocket = ({
  onMessageReceived,
  onTypingEvent,
  onError,
  onConnectionStatusChange,
}: UseWebSocketProps): UseWebSocketReturn => {
  const clientRef = useRef<Client | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");

  // roomId -> unsubscribe function
  const subscriptionsRef = useRef<Map<number, () => void>>(new Map());

  // Latest handlers, so room subscriptions keep a stable identity while the callers re-render
  const handlersRef = useRef({ onMessageReceived, onTypingEvent });
  useEffect(() => {
    handlersRef.current = { onMessageReceived, onTypingEvent };
  }, [onMessageReceived, onTypingEvent]);

  const updateConnectionStatus = useCallback(
    (status: ConnectionStatus) => {
      setConnectionStatus(status);
      onConnectionStatusChange(status);
    },
    [onConnectionStatusChange]
  );

  const connect = useCallback(() => {
    const token = getCurrentToken();
    if (!token) {
      updateConnectionStatus("error");
      return;
    }

    // Avoid duplicate activation
    if (clientRef.current?.active || clientRef.current?.connected) {
      return;
    }

    // Deactivate old client if any
    if (clientRef.current) {
      clientRef.current.deactivate();
      clientRef.current = null;
    }

    const socketFactory = () => new SockJS(WS_URL);
    updateConnectionStatus("connecting");

    const client = new Client({
      webSocketFactory: socketFactory,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      // Re-read the token before every (re)connect so automatic reconnects never use an expired one
      beforeConnect: () => {
        const latest = getCurrentToken();
        if (latest) {
          client.connectHeaders = { Authorization: `Bearer ${latest}` };
        }
      },
      // Let the library handle reconnection
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        updateConnectionStatus("connected");

        // Subscribe to server-side error queue (authorized by backend)
        client.subscribe("/user/queue/errors", (message) => {
          try {
            const error: WebSocketError = JSON.parse(message.body);
            onError(error);
          } catch (e) {
            onError({
              code: "PARSE_ERROR",
              message: "Failed to parse server error",
              type: "system_error",
            });
          }
        });
      },

      onDisconnect: () => {
        updateConnectionStatus("disconnected");
        // Clear all stored unsubscribe functions
        subscriptionsRef.current.clear();
      },

      onStompError: (frame) => {
        updateConnectionStatus("error");
        onError({
          code: "STOMP_ERROR",
          message: frame.headers?.message || "STOMP connection error",
          type: "system_error",
        });
        // Reconnect handled by reconnectDelay
      },

      onWebSocketError: () => {
        updateConnectionStatus("error");
        onError({
          code: "WEBSOCKET_ERROR",
          message: "WebSocket connection error",
          type: "system_error",
        });
        // Reconnect handled by reconnectDelay
      },

      onWebSocketClose: () => {
        // When the underlying socket closes
        if (clientRef.current?.active) {
          // Client will attempt reconnection if reconnectDelay set
          updateConnectionStatus("reconnecting");
        } else {
          updateConnectionStatus("disconnected");
        }
      },
    });

    clientRef.current = client;
    client.activate();
  }, [onError, updateConnectionStatus]);

  const disconnect = useCallback(() => {
    // Unsubscribe from all room topics
    subscriptionsRef.current.forEach((unsubscribe) => {
      try {
        unsubscribe();
      } catch {
        // ignore
      }
    });
    subscriptionsRef.current.clear();

    if (clientRef.current) {
      clientRef.current.deactivate();
      clientRef.current = null;
    }
    updateConnectionStatus("disconnected");
  }, [updateConnectionStatus]);

  const sendMessage = useCallback(
    (message: OutgoingMessage) => {
      if (!clientRef.current?.connected) {
        onError({
          code: "NOT_CONNECTED",
          message: "Cannot send message: WebSocket not connected",
          type: "chat_error",
        });
        return;
      }

      try {
        clientRef.current.publish({
          destination: "/app/sendMessage",
          body: JSON.stringify(message),
        });
      } catch (error) {
        onError({
          code: "SEND_ERROR",
          message: "Failed to send message",
          type: "chat_error",
        });
      }
    },
    [onError]
  );

  const startTyping = useCallback((roomId: number) => {
    if (!clientRef.current?.connected) return;

    try {
      clientRef.current.publish({
        destination: `/app/typing/start/room/${roomId}`,
        body: JSON.stringify({}),
      });
    } catch {
      // typing indicators are best effort
    }
  }, []);

  const stopTyping = useCallback((roomId: number) => {
    if (!clientRef.current?.connected) return;

    try {
      clientRef.current.publish({
        destination: `/app/typing/stop/room/${roomId}`,
        body: JSON.stringify({}),
      });
    } catch {
      // typing indicators are best effort
    }
  }, []);

  const markAsRead = useCallback((payload: ReadReceiptPayload) => {
    if (!clientRef.current?.connected) return;

    try {
      clientRef.current.publish({
        destination: "/app/markAsRead",
        body: JSON.stringify(payload),
      });
    } catch {
      // read receipts are retried on the next mark-as-read
    }
  }, []);

  const subscribeToRoom = useCallback(
    (roomId: number): (() => void) => {
      if (!clientRef.current?.connected) {
        return () => {};
      }

      // Unsubscribe existing, if present
      const existingUnsubscribe = subscriptionsRef.current.get(roomId);
      if (existingUnsubscribe) {
        try {
          existingUnsubscribe();
        } catch {
          // the previous subscription is already closed
        }
      }

      try {

        const messageSub: StompSubscription = clientRef.current.subscribe(
          `/topic/room.${roomId}`,
          (message) => {
            try {
              const chatMessage: ChatMessage = JSON.parse(message.body);
              handlersRef.current.onMessageReceived(chatMessage);
            } catch {
              // ignore malformed frames
            }
          }
        );

        const typingSub: StompSubscription = clientRef.current.subscribe(
          `/topic/typing.${roomId}`,
          (message) => {
            try {
              const typingEvent: TypingEvent = JSON.parse(message.body);
              handlersRef.current.onTypingEvent(typingEvent);
            } catch {
              // ignore malformed frames
            }
          }
        );

        const unsubscribe = () => {
          try {
            if (messageSub) {
              messageSub.unsubscribe();
            }
          } catch {
            // already unsubscribed
          }
          try {
            if (typingSub) {
              typingSub.unsubscribe();
            }
          } catch {
            // already unsubscribed
          }
          subscriptionsRef.current.delete(roomId);
        };

        subscriptionsRef.current.set(roomId, unsubscribe);

        return unsubscribe;
      } catch (error) {
        return () => {};
      }
    },
    []
  );

  const unsubscribeFromRoom = useCallback((roomId: number) => {
    const unsubscribe = subscriptionsRef.current.get(roomId);
    if (unsubscribe) {
      try {
        unsubscribe();
      } catch {
        // ignore
      }
    }
  }, []);

  return {
    connectionStatus,
    connect,
    disconnect,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead,
    subscribeToRoom,
    unsubscribeFromRoom,
  };
};

export default useWebSocket;
