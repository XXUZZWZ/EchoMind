import axios from "./config";

// 对话统计数据接口
export interface ConversationAnalytics {
  sessionId: string;          // 会话ID
  aiRoleId: string;          // AI角色ID
  startTime: number;         // 开始时间戳
  endTime?: number;          // 结束时间戳
  duration?: number;         // 会话时长(秒)
  messageCount: number;      // 消息数量
  userId?: string;           // 用户ID（如果已登录）
}

// 页面离开统计数据接口
export interface PageLeaveAnalytics {
  sessionId: string;         // 会话ID
  pageUrl: string;          // 页面URL
  enterTime: number;        // 进入时间戳
  leaveTime: number;        // 离开时间戳
  stayDuration: number;     // 停留时长(秒)
  leaveType: 'navigate' | 'close' | 'refresh'; // 离开方式
  currentAiRoleId?: string; // 当前AI角色
  userId?: string;          // 用户ID
}

// 对话统计上报
export const reportConversation = (data: ConversationAnalytics) => {
  return axios.post("/analytics/conversation", data);
};

// 页面离开统计上报
export const reportPageLeave = (data: PageLeaveAnalytics) => {
  return axios.post("/analytics/page-leave", data);
};

// 批量上报埋点数据
export const reportBatch = (data: {
  conversations?: ConversationAnalytics[],
  pageLeaves?: PageLeaveAnalytics[]
}) => {
  return axios.post("/analytics/batch", data);
};


