import api from './client';

interface ApiMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  readStatus: boolean;
  attachmentUrl?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
  attachmentName?: string;
}

function mapMessage(m: ApiMessage): ChatMessage {
  return {
    id: m.id,
    senderId: m.senderId,
    receiverId: m.receiverId,
    content: m.content,
    createdAt: m.createdAt,
    read: m.readStatus,
  };
}

export async function sendMessage(receiverId: string, content: string): Promise<void> {
  await api.post('/chat/messages', { receiverId, content });
}

export async function getConversation(otherId: string): Promise<ChatMessage[]> {
  const { data } = await api.get<ApiMessage[]>(`/chat/messages/${otherId}`);
  return data.map(mapMessage);
}

export async function getConversations(): Promise<{
  peerId: string;
  peerName: string;
  lastMessage: string;
  unreadCount: number;
  timestamp: string;
}[]> {
  const { data } = await api.get('/chat/conversations');
  return data;
}

export async function getUnreadCount(): Promise<number> {
  const { data } = await api.get<{ count: number }>('/chat/unread-count');
  return data.count ?? 0;
}
