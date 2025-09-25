import axios from "axios";


// 开发环境使用相对路径，这样会请求到本地mock服务
axios.defaults.baseURL =  'http://121.43.109.134/api';
// axios.defaults.baseURL =  import.meta.env.VITE_API_URL ;

axios.interceptors.response.use(
  (res) => {
    // 检查响应中的业务状态码
    if (res.data && res.data.code === 1) {
      // 如果业务状态码为1，表示业务错误，抛出异常
      console.error('业务错误:', res.data.message);
      throw new Error(res.data.message || '请求失败');
    }

    return res; // 返回完整响应，让调用方根据需要处理数据
  },
  (error) => {
    // 处理HTTP错误（404, 500等）
    console.error('HTTP请求错误:', error);
    console.error('error.response:', error.response);
    console.error('error.message:', error.message);

    // 更安全的错误处理
    let errorMessage = '网络请求失败';

    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
)
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  // 如果有就说明有token，已登录。
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
export default axios;