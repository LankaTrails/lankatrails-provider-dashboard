import type { LocationData, PriceType, ServiceType } from "@/types/serviceTypes";

export type ChatRoomType = 'GROUP' | 'DIRECT';

export type ChatMessageType = 'TEXT' | 'IMAGE' | 'FILE' | 'SERVICE_CARD' | 'SYSTEM' | 'REPLY';

export interface TouristDto {
    id: number;
    firstName: string;
    lastName: string;
    country: string;
    profilePictureUrl: string;
}

export interface ProviderDto {
    id: number;
    businessName: string;
    profilePictureUrl: string;
}

export interface Price {
    priceType: PriceType;
    amount: number;
}

export interface ServiceDTO {
    serviceId: number;
    serviceName: string | null;
    category: ServiceType | null;
    locations: LocationData[] | null;
    prices: Price[] | null;
    mainImageUrl: string | null;
}

export interface ChatFilesDto {
    id: string; // MongoDB document ID
    fileName: string;
    fileType: string;
    fileUrl: string;
}

export interface ChatDataResponse {
    id: number;
    userId: number;
    message: string;
    timestamp: string;
    status: 'sent' | 'received' | 'read';
}

export interface ChatRoom {
    id: number | null;
    chatRoomType: ChatRoomType;
    createdAt?: string;
    unreadCount?: number | null;
}

export interface DirectChatRoom extends ChatRoom {
    providerId: number | null;
    touristId: number | null;
    provider?: ProviderDto;
    tourist?: TouristDto;
}

export interface GroupChatRoom extends ChatRoom {
    tripId: number | null;
    participants: TouristDto[];
}

export interface ChatMessage {
    id: string | null;
    chatRoomId: number;
    senderId: number;
    messageType: ChatMessageType;
    content: string;
    sentAt: string; // ISO string representation of Instant
    replyToMessageId?: string | null;
    serviceCardId?: number | null;
    serviceCard?: ServiceDTO | null;
    files?: ChatFilesDto | null;
    readBy?: Record<number, string>; // userId -> timestamp when read
}

// WebSocket-related types
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error';

export interface WebSocketError {
    code: string;
    message: string;
    type: 'auth_error' | 'chat_error' | 'system_error';
}

export interface TypingEvent {
    userId: number;
    username: string;
    typing: boolean;
    roomId: number;
}

export interface ReadReceiptPayload {
    roomId?: number;
    messageId?: string;
}

export interface OutgoingMessage {
    chatRoomId: number;
    messageType: ChatMessageType;
    content: string;
    serviceCardId?: number;
}

export interface ChatState {
    rooms: DirectChatRoom[];
    activeRoomId: number | null;
    messages: Record<number, ChatMessage[]>;
    connectionStatus: ConnectionStatus;
    typingUsers: Record<number, TypingEvent[]>;
    isLoading: boolean;
    error: string | null;
}