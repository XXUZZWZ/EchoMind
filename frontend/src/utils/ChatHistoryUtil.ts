import LocalStorageUtil from './LocalStorageUtil';
import type { AiRoleItem } from '../types';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatHistoryItem {
  id: string;
  prompt: string;
  placeholder: string;
  imageUrl: string;
  lastMessage?: string;
  lastMessageTime?: number;
  messageCount: number;
  hasMessages: boolean;
}

class ChatHistoryUtil {
  private static instance: ChatHistoryUtil;

  private constructor() {}

  public static getInstance(): ChatHistoryUtil {
    if (!ChatHistoryUtil.instance) {
      ChatHistoryUtil.instance = new ChatHistoryUtil();
    }
    return ChatHistoryUtil.instance;
  }

  // 获取所有聊天历史记录
  getAllChatHistory(): ChatHistoryItem[] {
    const aiRoleList = LocalStorageUtil.getItem<AiRoleItem[]>('aiRoleList') || [];
    
    return aiRoleList.map(role => {
      const storageKey = `chat_messages_${role.prompt?.slice(0, 20) || 'default'}`;
      const messages = LocalStorageUtil.getItem<ChatMessage[]>(storageKey) || [];
      
      // 过滤掉系统消息，只看用户和助手的对话
      const userMessages = messages.filter(msg => msg.role !== 'system');
      const lastUserOrAssistantMessage = userMessages[userMessages.length - 1];
      
      return {
        id: role.id,
        prompt: role.prompt,
        placeholder: role.placeholder,
        imageUrl: role.imageUrl,
        lastMessage: lastUserOrAssistantMessage?.content || '',
        lastMessageTime: Date.now(),
        messageCount: userMessages.length,
        hasMessages: userMessages.length > 0
      };
    }).filter(item => item.hasMessages)
      .sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));
  }

  // 获取特定角色的消息
  getChatMessages(prompt: string): ChatMessage[] {
    const storageKey = `chat_messages_${prompt?.slice(0, 20) || 'default'}`;
    return LocalStorageUtil.getItem<ChatMessage[]>(storageKey) || [];
  }

  // 清除特定聊天记录
  clearChatHistory(prompt: string): void {
    const storageKey = `chat_messages_${prompt?.slice(0, 20) || 'default'}`;
    LocalStorageUtil.removeItem(storageKey);
  }

  // 清除所有聊天记录
  clearAllChatHistory(): void {
    const aiRoleList = LocalStorageUtil.getItem<AiRoleItem[]>('aiRoleList') || [];
    aiRoleList.forEach(role => {
      const storageKey = `chat_messages_${role.prompt?.slice(0, 20) || 'default'}`;
      LocalStorageUtil.removeItem(storageKey);
    });
  }

  // 格式化最后一条消息（截断长文本）
  formatLastMessage(message: string, maxLength: number = 50): string {
    if (!message) return '暂无消息';
    return message.length > maxLength 
      ? message.slice(0, maxLength) + '...' 
      : message;
  }

  // 格式化消息时间
  formatMessageTime(timestamp: number): string {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now.getTime() - messageTime.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return '刚刚';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}小时前`;
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}天前`;
    } else {
      return messageTime.toLocaleDateString();
    }
  }
}

export default ChatHistoryUtil.getInstance();
