import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "@/hooks/useWebSocket";
import { getMyChatRooms, getRoomMessages } from "@/services/chatService";
import type {
  ChatState,
  DirectChatRoom,
  ChatMessage,
  ConnectionStatus,
  WebSocketError,
  TypingEvent,
  OutgoingMessage,
} from "@/types/chatTypes";
import { useAuth } from "@/hooks/useAuth";
import { getCurrentToken } from "@/services/tokenService";

// Action types
type ChatAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_ROOMS"; payload: DirectChatRoom[] }
  | { type: "SET_ACTIVE_ROOM"; payload: number | null }
  | {
      type: "SET_ROOM_MESSAGES";
      payload: { roomId: number; messages: ChatMessage[] };
    }
  | { type: "ADD_MESSAGE"; payload: ChatMessage }
  | { type: "UPDATE_MESSAGE"; payload: ChatMessage }
  | { type: "SET_CONNECTION_STATUS"; payload: ConnectionStatus }
  | {
      type: "SET_TYPING_USERS";
      payload: { roomId: number; users: TypingEvent[] };
    }
  | { type: "CLEAR_TYPING_USER"; payload: { roomId: number; userId: number } };

// Initial state
const initialState: ChatState = {
  rooms: [],
  activeRoomId: null,
  messages: {},
  connectionStatus: "disconnected",
  typingUsers: {},
  isLoading: false,
  error: null,
};

// Reducer
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_ROOMS":
      return { ...state, rooms: action.payload };

    case "SET_ACTIVE_ROOM":
      return { ...state, activeRoomId: action.payload };

    case "SET_ROOM_MESSAGES":
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.roomId]: action.payload.messages,
        },
      };

    case "ADD_MESSAGE": {
      const roomId = action.payload.chatRoomId;
      const prev = state.messages[roomId] || [];
      return {
        ...state,
        messages: {
          ...state.messages,
          [roomId]: [...prev, action.payload],
        },
      };
    }

    case "UPDATE_MESSAGE": {
      const updatedRoomId = action.payload.chatRoomId;
      const prev = state.messages[updatedRoomId] || [];
      return {
        ...state,
        messages: {
          ...state.messages,
          [updatedRoomId]: prev.map((msg) =>
            msg.id === action.payload.id ? action.payload : msg
          ),
        },
      };
    }

    case "SET_CONNECTION_STATUS":
      return { ...state, connectionStatus: action.payload };

    case "SET_TYPING_USERS": {
      return {
        ...state,
        typingUsers: {
          ...state.typingUsers,
          [action.payload.roomId]: [...action.payload.users],
        },
      };
    }

    case "CLEAR_TYPING_USER": {
      const currentUsers = state.typingUsers[action.payload.roomId] || [];
      const filtered = currentUsers.filter(
        (u) => u.userId !== action.payload.userId
      );
      return {
        ...state,
        typingUsers: {
          ...state.typingUsers,
          [action.payload.roomId]: filtered,
        },
      };
    }

    default:
      return state;
  }
};

// Context types
interface ChatContextType {
  state: ChatState;
  // Room management
  loadRooms: () => Promise<void>;
  setActiveRoom: (roomId: number | null) => void;
  loadRoomMessages: (roomId: number) => Promise<void>;

  // Messaging
  sendMessage: (message: Omit<OutgoingMessage, "chatRoomId">) => void;
  sendServiceCard: (serviceCardId: number) => void;

  // Typing indicators
  startTyping: () => void;
  stopTyping: () => void;

  // Read receipts
  markMessageAsRead: (messageId: number | string) => void;
  markRoomAsRead: (roomId: number) => void;

  // Connection management
  connect: () => void;
  disconnect: () => void;

  // Helper functions
  getActiveRoom: () => DirectChatRoom | null;
  getActiveMessages: () => ChatMessage[];
  getTypingUsers: (roomId?: number) => TypingEvent[];
}

const ChatContext = createContext<ChatContextType | null>(null);

// Provider component
interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { toast } = useToast();
  const { user } = useAuth();

  // WebSocket event handlers
  const handleMessageReceived = useCallback(
    (message: ChatMessage) => {
      // console.log("[Chat] Message received:", message);
      dispatch({ type: "ADD_MESSAGE", payload: message });

      if (message.chatRoomId !== state.activeRoomId) {
        toast({
          title: "New Message",
          description: `${message.content || "File message"}`,
        });
      }
    },
    [state.activeRoomId, toast]
  );

  const handleTypingEvent = useCallback(
    (event: TypingEvent) => {
      console.log("[Chat] Typing event received:", event);
      console.log(
        "[Chat] Current user ID:",
        user?.id,
        "Event user ID:",
        event.userId
      );

      if (event.typing) {
        const currentUsers = state.typingUsers[event.roomId] || [];
        const existingIndex = currentUsers.findIndex(
          (u) => u.userId === event.userId
        );

        const nextUsers = [...currentUsers];
        if (existingIndex >= 0) {
          nextUsers[existingIndex] = event;
        } else {
          nextUsers.push(event);
        }

        console.log(
          "[Chat] Updated typing users for room",
          event.roomId,
          ":",
          nextUsers
        );

        dispatch({
          type: "SET_TYPING_USERS",
          payload: { roomId: event.roomId, users: nextUsers },
        });

        // Auto-clear typing after 3 seconds
        setTimeout(() => {
          console.log("[Chat] Auto-clearing typing for user:", event.userId);
          dispatch({
            type: "CLEAR_TYPING_USER",
            payload: { roomId: event.roomId, userId: event.userId },
          });
        }, 3000);
      } else {
        // Remove typing user
        console.log(
          "[Chat] Removing typing user:",
          event.userId,
          "from room:",
          event.roomId
        );
        dispatch({
          type: "CLEAR_TYPING_USER",
          payload: { roomId: event.roomId, userId: event.userId },
        });
      }
    },
    [state.typingUsers, user?.id]
  );

  const handleWebSocketError = useCallback(
    (error: WebSocketError) => {
      console.error("[Chat] WebSocket error:", error);

      let title = "Connection Error";
      let description = error.message;

      switch (error.type) {
        case "auth_error":
          title = "Authentication Error";
          description = "Please log in again";
          break;
        case "chat_error":
          title = "Chat Error";
          break;
        case "system_error":
          title = "System Error";
          break;
      }

      toast({
        title,
        description,
        variant: "destructive",
      });

      dispatch({ type: "SET_ERROR", payload: error.message });
    },
    [toast]
  );

  const handleConnectionStatusChange = useCallback(
    (status: ConnectionStatus) => {
      // console.log("[Chat] Connection status changed:", status);
      dispatch({ type: "SET_CONNECTION_STATUS", payload: status });

      if (status === "connected") {
        dispatch({ type: "SET_ERROR", payload: null });
        toast({
          title: "Connected",
          description: "Real-time chat is now active",
        });
      } else if (status === "disconnected") {
        toast({
          title: "Disconnected",
          description: "Chat connection lost",
          variant: "destructive",
        });
      } else if (status === "reconnecting") {
        toast({
          title: "Reconnecting",
          description: "Attempting to restore connection...",
        });
      }
    },
    [toast]
  );

  // Initialize WebSocket
  const {
    connect,
    disconnect,
    sendMessage: wsSendMessage,
    startTyping: wsStartTyping,
    stopTyping: wsStopTyping,
    markAsRead,
    subscribeToRoom,
  } = useWebSocket({
    onMessageReceived: handleMessageReceived,
    onTypingEvent: handleTypingEvent,
    onError: handleWebSocketError,
    onConnectionStatusChange: handleConnectionStatusChange,
  });

  // Room management
  const loadRooms = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await getMyChatRooms();

      if (response.success && response.data) {
        dispatch({ type: "SET_ROOMS", payload: response.data });
      } else {
        throw new Error("Failed to load chat rooms");
      }
    } catch (error) {
      console.error("[Chat] Error loading rooms:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to load chat rooms" });
      toast({
        title: "Error",
        description: "Failed to load chat rooms",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [toast]);

  const setActiveRoom = useCallback((roomId: number | null) => {
    // Only set the active room. Subscription/unsubscription is handled by the effect below.
    dispatch({ type: "SET_ACTIVE_ROOM", payload: roomId });
  }, []);

  const loadRoomMessages = useCallback(
    async (roomId: number) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const response = await getRoomMessages(roomId);

        if (response.success && response.data) {
          dispatch({
            type: "SET_ROOM_MESSAGES",
            payload: { roomId, messages: response.data },
          });
        } else {
          throw new Error("Failed to load messages");
        }
      } catch (error) {
        console.error("[Chat] Error loading messages:", error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [toast]
  );

  // Messaging
  const sendMessage = useCallback(
    (message: Omit<OutgoingMessage, "chatRoomId">) => {
      if (!state.activeRoomId) {
        toast({
          title: "Error",
          description: "No active room selected",
          variant: "destructive",
        });
        return;
      }

      wsSendMessage({
        ...message,
        chatRoomId: state.activeRoomId,
      });
    },
    [state.activeRoomId, wsSendMessage, toast]
  );

  const sendServiceCard = useCallback(
    (serviceCardId: number) => {
      sendMessage({
        messageType: "SERVICE_CARD",
        content: "",
        serviceCardId,
      });
    },
    [sendMessage]
  );

  // Typing
  const startTyping = useCallback(() => {
    if (state.activeRoomId) {
      wsStartTyping(state.activeRoomId);
    }
  }, [state.activeRoomId, wsStartTyping]);

  const stopTyping = useCallback(() => {
    if (state.activeRoomId) {
      wsStopTyping(state.activeRoomId);
    }
  }, [state.activeRoomId, wsStopTyping]);

  // Read receipts
  const markMessageAsRead = useCallback(
    (messageId: number | string) => {
      markAsRead({ messageId } as any);
    },
    [markAsRead]
  );

  const markRoomAsRead = useCallback(
    (roomId: number) => {
      markAsRead({ roomId });
    },
    [markAsRead]
  );

  // Helpers
  const getActiveRoom = useCallback((): DirectChatRoom | null => {
    return state.rooms.find((room) => room.id === state.activeRoomId) || null;
  }, [state.rooms, state.activeRoomId]);

  const getActiveMessages = useCallback((): ChatMessage[] => {
    return state.activeRoomId ? state.messages[state.activeRoomId] || [] : [];
  }, [state.messages, state.activeRoomId]);

  const getTypingUsers = useCallback(
    (roomId?: number): TypingEvent[] => {
      const targetRoomId = roomId ?? state.activeRoomId;
      return targetRoomId ? state.typingUsers[targetRoomId] || [] : [];
    },
    [state.typingUsers, state.activeRoomId]
  );

  // Auto-subscribe to active room when connected or when activeRoom changes
  useEffect(() => {
    if (state.activeRoomId && state.connectionStatus === "connected") {
      console.log("[Chat] Subscribing to room:", state.activeRoomId);
      const unsubscribe = subscribeToRoom(state.activeRoomId);
      return () => {
        console.log(
          "[Chat] Cleaning up subscription for room:",
          state.activeRoomId
        );
        try {
          unsubscribe();
        } catch (error) {
          console.warn("[Chat] Error during cleanup:", error);
        }
      };
    } else {
      console.log(
        "[Chat] Not subscribing - room:",
        state.activeRoomId,
        "status:",
        state.connectionStatus
      );
    }
  }, [state.activeRoomId, state.connectionStatus]);

  // Load messages when active room changes
  useEffect(() => {
    if (state.activeRoomId) {
      console.log("[Chat] Active room changed to:", state.activeRoomId);
      // Check if we already have messages for this room
      const existingMessages = state.messages[state.activeRoomId];
      if (!existingMessages || existingMessages.length === 0) {
        console.log("[Chat] Loading messages for room:", state.activeRoomId);
        loadRoomMessages(state.activeRoomId);
      } else {
        console.log(
          "[Chat] Messages already loaded for room:",
          state.activeRoomId,
          "count:",
          existingMessages.length
        );
      }
    }
  }, [state.activeRoomId]);

  // Load rooms on mount
  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  // Connect when authenticated; disconnect when not
  useEffect(() => {
    const token = getCurrentToken();
    if (user && token) {
      connect();
    } else {
      disconnect();
    }
  }, [user, connect, disconnect]);

  // Disconnect on unmount (safety)
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const contextValue: ChatContextType = {
    state,
    loadRooms,
    setActiveRoom,
    loadRoomMessages,
    sendMessage,
    sendServiceCard,
    startTyping,
    stopTyping,
    markMessageAsRead,
    markRoomAsRead,
    connect,
    disconnect,
    getActiveRoom,
    getActiveMessages,
    getTypingUsers,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};

// Custom hook to use chat context
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export default ChatProvider;
