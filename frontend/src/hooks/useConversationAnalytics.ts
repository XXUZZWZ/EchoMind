import { useEffect, useRef, useCallback, useState } from 'react';
import analyticsManager from '../utils/AnalyticsUtil';

export interface UseConversationAnalyticsOptions {
  aiRoleId?: string;
  prompt?: string;
  autoStart?: boolean;
  autoEnd?: boolean;
}

/**
 * 对话级埋点Hook
 * 自动处理对话开始/结束/消息统计
 */
export const useConversationAnalytics = (options: UseConversationAnalyticsOptions = {}) => {
  const {
    aiRoleId: providedAiRoleId,
    prompt,
    autoStart = false,
    autoEnd = true
  } = options;

  const conversationIdRef = useRef<string | null>(null);
  const aiRoleIdRef = useRef<string>('');
  const [isActive, setIsActive] = useState(false);

  // 安全的btoa函数（兼容不同环境）
  const safeBtoa = useCallback((str: string): string => {
    try {
      if (typeof btoa !== 'undefined') {
        return btoa(str);
      } else {
        // 简单的fallback编码（避免Node.js Buffer依赖）
        return str.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
      }
    } catch {
      return str.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
    }
  }, []);

  // 生成AI角色ID
  const generateAiRoleId = useCallback((promptText?: string) => {
    if (providedAiRoleId) return providedAiRoleId;
    if (promptText) return `role_${safeBtoa(promptText.slice(0, 20)).slice(0, 10)}`;
    return 'default';
  }, [providedAiRoleId, safeBtoa]);

  useEffect(() => {
    aiRoleIdRef.current = generateAiRoleId(prompt);

    // 设置当前AI角色
    analyticsManager.setCurrentAiRoleId(aiRoleIdRef.current);

    // 自动开始对话统计
    if (autoStart && !conversationIdRef.current) {
      conversationIdRef.current = analyticsManager.startConversation(aiRoleIdRef.current);
      setIsActive(true);
    }

    return () => {
      // 自动结束对话统计
      if (autoEnd && conversationIdRef.current) {
        analyticsManager.endConversation(conversationIdRef.current);
        conversationIdRef.current = null;
        setIsActive(false);
      }
    };
  }, [prompt, autoStart, autoEnd, generateAiRoleId]);

  // 开始对话统计
  const startConversation = useCallback(() => {
    if (!conversationIdRef.current) {
      conversationIdRef.current = analyticsManager.startConversation(aiRoleIdRef.current);
      setIsActive(true);
    }
    return conversationIdRef.current;
  }, []);

  // 结束对话统计
  const endConversation = useCallback(async () => {
    if (conversationIdRef.current) {
      await analyticsManager.endConversation(conversationIdRef.current);
      conversationIdRef.current = null;
      setIsActive(false);
    }
  }, []);

  // 记录消息发送
  const recordMessage = useCallback(() => {
    if (!conversationIdRef.current) {
      // 如果还没开始对话，自动开始
      startConversation();
    }

    if (conversationIdRef.current) {
      analyticsManager.recordMessage(conversationIdRef.current);
    }
  }, [startConversation]);

  // 切换AI角色
  const switchAiRole = useCallback((newAiRoleId: string) => {
    // 结束当前对话
    if (conversationIdRef.current) {
      analyticsManager.endConversation(conversationIdRef.current);
      conversationIdRef.current = null;
      setIsActive(false);
    }

    // 设置新的AI角色
    aiRoleIdRef.current = newAiRoleId;
    analyticsManager.setCurrentAiRoleId(newAiRoleId);
  }, []);

  return {
    conversationId: conversationIdRef.current,
    aiRoleId: aiRoleIdRef.current,
    startConversation,
    endConversation,
    recordMessage,
    switchAiRole,
    isActive
  };
};
