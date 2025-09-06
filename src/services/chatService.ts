import api from '@/api/axiosInstance';
import type { ChatMessage, DirectChatRoom } from '@/types/chatTypes';
import type { ApiResponse } from '@/types/serviceTypes';

/**
 * Get all chat rooms for the authenticated user
 */
export async function getMyChatRooms(): Promise<ApiResponse<DirectChatRoom[]>> {
    try {
        console.log('[Chat] Fetching chat rooms for authenticated user');
        const response = await api.get<ApiResponse<DirectChatRoom[]>>('/chat/rooms/my-rooms');
        console.log(`[Chat] Fetched ${response.data.data?.length || 0} chat rooms:`, response.data);
        return response.data;
    } catch (error) {
        console.log('[Chat] Error fetching chat rooms:', error);
        throw error;
    }
}

/**
 * Get all messages for a specific chat room
 */
export async function getRoomMessages(
    roomId: number
): Promise<ApiResponse<ChatMessage[]>> {
    try {
        console.log(`[Chat] Fetching messages for room ID: ${roomId}`);
        const response = await api.get<ApiResponse<ChatMessage[]>>(`/chat/rooms/${roomId}/messages`);
        console.log(`[Chat] Messages fetched for room ${roomId}:`, response.data);
        return response.data;
    } catch (error) {
        console.log('[Chat] Error fetching room messages:', error);

        // Handle 302 status
        if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as any;
            if (axiosError.response?.status === 302 && axiosError.response?.data) {
                console.log(`[Chat] Messages found (302), returning data:`, axiosError.response.data);
                return axiosError.response.data;
            }
        }

        throw error;
    }
}

/**
 * Send a file message to a chat room
 */
export async function sendFileMessage(
    roomId: number,
    message: ChatMessage,
    file: File
): Promise<void> {
    try {
        console.log(`[Chat] Sending file message to room ${roomId}`);

        const formData = new FormData();
        formData.append('message', JSON.stringify(message));
        formData.append('file', file);

        await api.post(`/chat/${roomId}/send-file`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log(`[Chat] File message sent successfully to room ${roomId}`);
    } catch (error) {
        console.log('[Chat] Error sending file message:', error);
        throw error;
    }
}

/**
 * Mark a specific message as read
 */
export async function markMessageAsRead(
    messageId: string
): Promise<ApiResponse<string>> {
    try {
        console.log(`[Chat] Marking message as read: ${messageId}`);
        const response = await api.put<ApiResponse<string>>(`/chat/messages/${messageId}/read`);
        console.log(`[Chat] Message marked as read:`, response.data);
        return response.data;
    } catch (error) {
        console.log('[Chat] Error marking message as read:', error);
        throw error;
    }
}

/**
 * Mark all messages in a room as read
 */
export async function markAllMessagesAsRead(
    roomId: number
): Promise<ApiResponse<string>> {
    try {
        console.log(`[Chat] Marking all messages as read in room: ${roomId}`);
        const response = await api.put<ApiResponse<string>>(`/chat/rooms/${roomId}/read-all`);
        console.log(`[Chat] All messages marked as read in room ${roomId}:`, response.data);
        return response.data;
    } catch (error) {
        console.log('[Chat] Error marking all messages as read:', error);
        throw error;
    }
}
