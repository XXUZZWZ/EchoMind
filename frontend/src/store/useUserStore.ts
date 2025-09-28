import { create } from "zustand";
import { doLogin, doRegister, checkLogin } from "../api/user";
import ChatHistoryUtil from "../utils/ChatHistoryUtil";

// 定义store的类型
interface UserStore {
  user: any;
  isLogin: boolean;
  Login: (credentials: { username?: string; password?: string }) => Promise<void>;
  Register: (credentials: { username?: string; password?: string }) => Promise<void>;
  Logout: () => void;
  CheckLogin: () => Promise<void>;
  InitializeAuth: () => Promise<void>;
}

// 检查初始登录状态
const checkInitialLoginStatus = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await checkLogin();
      // 假设成功响应包含用户信息，失败时会抛出错误
      return !!response.data;
    } catch (error) {
      // token无效，清除它
      localStorage.removeItem('token');
      return false;
    }
  }
  return false;
};

// 创建 store
export const useUserStore = create<UserStore>((set) => ({
  user: null, // 用户信息
  isLogin: !!localStorage.getItem('token'), // 初始根据token存在与否设置登录状态
  Login: async ({ username = "", password = "" }) => {
    const res = await doLogin({ username, password });

    // 现在axios返回完整响应，需要从res.data获取数据
    const { token, data: user } = res.data as { token: string; data: any };

    console.log("登录成功", user);
    localStorage.setItem("token", token);
    set({
      user,
      isLogin: true,
    });
  },
  Register: async ({ username = "", password = "" }) => {
    const res = await doRegister({ username, password });

    // 现在axios返回完整响应，需要从res.data获取数据
    const token = res?.data?.token;
    const user = res?.data?.data;

    if (!token) {
      throw new Error('注册响应中缺少token');
    }
    if (!user) {
      throw new Error('注册响应中缺少用户信息');
    }

    console.log("注册成功", user);
    localStorage.setItem("token", token);
    set({
      user,
      isLogin: true,
    });
  },
  Logout: () => {
    localStorage.removeItem("token");
    ChatHistoryUtil.clearAllChatHistory();
    set({
      user: null,
      isLogin: false,
    });
  },
  CheckLogin: async () => {
    try {
      const response = await checkLogin();
      // 如果请求成功，说明token有效
      set({
        isLogin: !!response.data,
      });
    } catch (error) {
      // token无效
      set({
        isLogin: false,
      });
    }
  },
  // 初始化时检查登录状态
  InitializeAuth: async () => {
    const isValidLogin = await checkInitialLoginStatus();
    set({
      isLogin: isValidLogin,
    });
  },
}));
