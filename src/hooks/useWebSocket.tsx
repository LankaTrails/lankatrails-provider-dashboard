import { useRef, useCallback, useState } from "react";
import { Client } from "@stomp/stompjs";
import type { StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getCurrentToken } from "@/services/tokenService";
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

function resolveWsUrl(): string {
  // Prefer env value if provided
  //   const envUrl = typeof window !== "undefined" ? (window as any)?.env?.NEXT_PUBLIC_WS_BASE_URL || process.env.NEXT_PUBLIC_WS_BASE_URL : process.env.NEXT_PUBLIC_WS_BASE_URL;
  //   if (envUrl) return envUrl;

  //   // Fallback to same-origin path if available, else localhost for SSR
  //   if (typeof window !== "undefined") {
  //     const { protocol, host } = window.location;
  //     const httpProtocol = protocol === "https:" ? "https" : "http";
  //     return `${httpProtocol}://${host}/ws`;
  //   }

  return "http://localhost:8080/ws";
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
      console.error("[WebSocket] No authentication token available");
      updateConnectionStatus("error");
      return;
    }

    // Avoid duplicate activation
    if (clientRef.current?.active || clientRef.current?.connected) {
      console.log("[WebSocket] Client already active/connected");
      return;
    }

    // Deactivate old client if any
    if (clientRef.current) {
      clientRef.current.deactivate();
      clientRef.current = null;
    }

    const wsBaseUrl = resolveWsUrl();
    const socketFactory = () => new SockJS(wsBaseUrl);
    updateConnectionStatus("connecting");

    const client = new Client({
      webSocketFactory: socketFactory,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        // Useful while diagnosing
        console.log("[WebSocket Debug]", str);
      },
      // Let the library handle reconnection
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: (frame) => {
        console.log("[WebSocket] Connected:", frame);
        updateConnectionStatus("connected");

        // Subscribe to server-side error queue (authorized by backend)
        client.subscribe("/user/queue/errors", (message) => {
          try {
            const error: WebSocketError = JSON.parse(message.body);
            console.error("[WebSocket] Server error:", error);
            onError(error);
          } catch (e) {
            console.error("[WebSocket] Failed to parse error message:", e);
            onError({
              code: "PARSE_ERROR",
              message: "Failed to parse server error",
              type: "system_error",
            });
          }
        });
      },

      onDisconnect: (frame) => {
        console.log("[WebSocket] Disconnected:", frame);
        updateConnectionStatus("disconnected");
        // Clear all stored unsubscribe functions
        subscriptionsRef.current.clear();
      },

      onStompError: (frame) => {
        console.error("[WebSocket] STOMP error:", frame);
        updateConnectionStatus("error");
        onError({
          code: "STOMP_ERROR",
          message: frame.headers?.message || "STOMP connection error",
          type: "system_error",
        });
        // Reconnect handled by reconnectDelay
      },

      onWebSocketError: (error) => {
        console.error("[WebSocket] WebSocket error:", error);
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
        console.error("[WebSocket] Cannot send message: not connected");
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
        console.log("[WebSocket] Message sent:", message);
      } catch (error) {
        console.error("[WebSocket] Failed to send message:", error);
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
      console.log("[WebSocket] Started typing in room:", roomId);
    } catch (error) {
      console.error("[WebSocket] Failed to send typing start:", error);
    }
  }, []);

  const stopTyping = useCallback((roomId: number) => {
    if (!clientRef.current?.connected) return;

    try {
      clientRef.current.publish({
        destination: `/app/typing/stop/room/${roomId}`,
        body: JSON.stringify({}),
      });
      console.log("[WebSocket] Stopped typing in room:", roomId);
    } catch (error) {
      console.error("[WebSocket] Failed to send typing stop:", error);
    }
  }, []);

  const markAsRead = useCallback((payload: ReadReceiptPayload) => {
    if (!clientRef.current?.connected) return;

    try {
      clientRef.current.publish({
        destination: "/app/markAsRead",
        body: JSON.stringify(payload),
      });
      // console.log("[WebSocket] Mark as read sent:", payload);
    } catch (error) {
      console.error("[WebSocket] Failed to send mark as read:", error);
    }
  }, []);

  const subscribeToRoom = useCallback(
    (roomId: number): (() => void) => {
      if (!clientRef.current?.connected) {
        console.warn("[WebSocket] Cannot subscribe: not connected");
        return () => {};
      }

      // Unsubscribe existing, if present
      const existingUnsubscribe = subscriptionsRef.current.get(roomId);
      if (existingUnsubscribe) {
        console.log(
          "[WebSocket] Cleaning up existing subscription for room:",
          roomId
        );
        try {
          existingUnsubscribe();
        } catch (error) {
          console.warn(
            "[WebSocket] Error cleaning up existing subscription:",
            error
          );
        }
      }

      try {
        console.log("[WebSocket] Creating new subscriptions for room:", roomId);

        const messageSub: StompSubscription = clientRef.current.subscribe(
          `/topic/room.${roomId}`,
          (message) => {
            try {
              console.log(
                "[WebSocket] Received message for room:",
                roomId,
                message.body
              );
              const chatMessage: ChatMessage = JSON.parse(message.body);
              onMessageReceived(chatMessage);
            } catch (error) {
              console.error("[WebSocket] Failed to parse message:", error);
            }
          }
        );

        const typingSub: StompSubscription = clientRef.current.subscribe(
          `/topic/typing.${roomId}`,
          (message) => {
            try {
              console.log(
                "[WebSocket] Received typing event for room:",
                roomId,
                "Raw message:",
                message.body
              );
              const typingEvent: TypingEvent = JSON.parse(message.body);
              console.log("[WebSocket] Parsed typing event:", typingEvent);
              onTypingEvent(typingEvent);
            } catch (error) {
              console.error("[WebSocket] Failed to parse typing event:", error);
            }
          }
        );

        const unsubscribe = () => {
          console.log("[WebSocket] Unsubscribing from room:", roomId);
          try {
            if (messageSub) {
              messageSub.unsubscribe();
            }
          } catch (error) {
            console.warn(
              "[WebSocket] Error unsubscribing from messages:",
              error
            );
          }
          try {
            if (typingSub) {
              typingSub.unsubscribe();
            }
          } catch (error) {
            console.warn("[WebSocket] Error unsubscribing from typing:", error);
          }
          subscriptionsRef.current.delete(roomId);
          console.log("[WebSocket] Unsubscribed from room:", roomId);
        };

        subscriptionsRef.current.set(roomId, unsubscribe);
        console.log("[WebSocket] Subscribed to room:", roomId);

        return unsubscribe;
      } catch (error) {
        console.error("[WebSocket] Failed to subscribe to room:", error);
        return () => {};
      }
    },
    [onMessageReceived, onTypingEvent]
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
