import api from '@/api/axiosInstance';
import { toApiError } from '@/lib/apiError';
import type { ChatMessage, DirectChatRoom } from '@/types/chatTypes';
import type { ApiResponse } from '@/types/serviceTypes';

/**
 * Get all chat rooms for the authenticated user
 */
export async function getMyChatRooms(): Promise<ApiResponse<DirectChatRoom[]>> {
    try {
        const response = await api.get<ApiResponse<DirectChatRoom[]>>('/chat/rooms/my-rooms');
        return response.data;
    } catch (error) {
        throw toApiError(error, "Could not load your conversations");
    }
}

/**
 * Get all messages for a specific chat room
 */
export async function getRoomMessages(
    roomId: number
): Promise<ApiResponse<ChatMessage[]>> {
    try {
        const response = await api.get<ApiResponse<ChatMessage[]>>(`/chat/rooms/${roomId}/messages`);
        return response.data;
    } catch (error) {

        throw toApiError(error, "Could not load messages");
    }
}

/**
 * Send a file message to a chat room with proper multipart/form-data structure
 */
export async function sendFileMessage(
    roomId: number,
    messageData: {
        messageType: string;
        content: string;
        caption?: string;
    },
    file: File
): Promise<ApiResponse<ChatMessage>> {
    try {

        const formData = new FormData();

        // Add the message data as JSON
        formData.append('messageData', JSON.stringify(messageData));

        // Add the file
        formData.append('file', file);

        const response = await api.post<ApiResponse<ChatMessage>>(`/chat/rooms/${roomId}/send-file`, formData, {
            headers: {
                // Don't set Content-Type explicitly - let the browser set it with boundary
                // 'Content-Type': 'multipart/form-data' would override boundary
            },
        });

        return response.data;
    } catch (error) {
        throw toApiError(error, "Could not send the file");
    }
}
