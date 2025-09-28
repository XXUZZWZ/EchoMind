import { useEffect, useRef } from 'react';
import analyticsManager from '../utils/AnalyticsUtil';
import { useUserStore } from '../store/useUserStore';

export interface UsePageAnalyticsOptions {
  pageUrl?: string;
  autoTrack?: boolean;
  trackOnMount?: boolean;
}

/**
 * 页面级埋点Hook
 * 自动处理页面进入/离开统计
 */
export const usePageAnalytics = (options: UsePageAnalyticsOptions = {}) => {
  const { 
    pageUrl = typeof window !== 'undefined' ? window.location.href : '', 
    autoTrack = true, 
    trackOnMount = true 
  } = options;
  
  const { user, isLogin } = useUserStore();
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (!autoTrack) return;

    // 设置用户ID（如果已登录）
    if (isLogin && user?.id) {
      analyticsManager.setUserId(user.id);
    }

    // 页面进入埋点
    if (trackOnMount && !hasTrackedRef.current) {
      analyticsManager.pageEnter(pageUrl);
      hasTrackedRef.current = true;
    }

    return () => {
      // 页面离开埋点
      if (hasTrackedRef.current) {
        analyticsManager.pageLeave('navigate');
        hasTrackedRef.current = false;
      }
    };
  }, [pageUrl, autoTrack, trackOnMount, isLogin, user]);

  // 手动触发页面进入统计
  const trackPageEnter = (url?: string) => {
    analyticsManager.pageEnter(url || pageUrl);
    hasTrackedRef.current = true;
  };

  // 手动触发页面离开统计
  const trackPageLeave = (leaveType: 'navigate' | 'close' | 'refresh' = 'navigate') => {
    if (hasTrackedRef.current) {
      analyticsManager.pageLeave(leaveType);
      hasTrackedRef.current = false;
    }
  };

  return {
    trackPageEnter,
    trackPageLeave,
    isTracking: hasTrackedRef.current
  };
};
