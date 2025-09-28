import Mock from "mockjs";
import pkg from "jsonwebtoken";
// 每页10个
const getImages = (page, pageSize = 10) => {
  return Array.from({ length: pageSize }, (_, i) => ({
    id: `${page}-${i}`,
    height: Mock.Random.integer(300, 600),
    url: Mock.Random.image("300x400", Mock.Random.color(), "#fff", "image"),
  }));
};

const { sign, decode } = pkg;
// 服务端私钥
const secret = "jwt-demo-secret";
const getAiRole = (page, pageSize = 10) => {
  return Array.from({ length: pageSize }, (_, i) => ({
    id: `${page}-${i}`,
    prompt: Mock.Random.csentence(20, 30),
    placeholder: Mock.Random.csentence(5, 10),
    imageUrl: Mock.Random.image(
      "412x915",
      Mock.Random.color(),
      "#fff",
      "image"
    ),
  }));
};
export default [
  // 搜索页推荐接口
  {
    url: "/api/search",
    method: "get",
    timeout: "1000",
    response: (req, res) => {
      const keyword = req.query.keyword;
      let num = Math.floor(Math.random() * 10);
      let list = [];
      for (let i = 0; i < num; i++) {
        // 随机内容
        const randomData = Mock.mock({
          title: "@ctitle(3,6)",
        });
        console.log(randomData);
        list.push(`${randomData.title} ${keyword}`);
      }
      // ? keyword = 是query 前端传递方式
      return {
        code: 0,
        data: list,
      };
    },
  },
  // 搜索热词接口
  {
    url: "/api/hotlist",
    method: "get",
    response: () => {
      return {
        code: 0,
        data: [
          {
            id: "101",
            role: "猫娘",
          },
          {
            id: "102",
            role: "精灵",
          },
          {
            id: "103",
            role: "机器瓦力",
          },
          {
            id: "104",
            role: "外星人",
          },
        ],
      };
    },
  },
  // 详情页接口
  {
    url: "/api/detail/:id",
    method: "get",
    response: (req, res) => {
      const randomData = Mock.mock({
        title: "@ctitle(5,10)",
        price: "@integer(1000, 5000)",
        desc: "@cparagraph(3,4)",
        images: [
          {
            url: "@image(200x200, @color,#fff,@ctitle)",
            alt: "@ctitle(5,10)",
          },
          {
            url: "@image(200x200, @color,#fff,@ctitle)",
            alt: "@ctitle(5,10)",
          },
          {
            url: "@image(200x200, @color,#fff,@ctitle)",
            alt: "@ctitle(5,10)",
          },
          {
            url: "@image(200x200, @color,#fff,@ctitle)",
            alt: "@ctitle(5,10)",
          },
          {
            url: "@image(200x200, @color,#fff,@ctitle)",
            alt: "@ctitle(5,10)",
          },
          {
            url: "@image(200x200, @color,#fff,@ctitle)",
            alt: "@ctitle(5,10)",
          },
          {
            url: "@image(200x200, @color,#fff,@ctitle)",
            alt: "@ctitle(5,10)",
          },
          {
            url: "@image(200x200, @color,#fff,@ctitle)",
            alt: "@ctitle(5,10)",
          },
        ],
      });
      return {
        code: 0,
        data: randomData,
      };
    },
  },
  // 图片含多页分页接口
  {
    // ?page=1 url 里的queryString
    url: "/api/images",
    method: "get",
    response: ({ query }) => {
      const page = Number(query.page); // 将string 转成 number
      return {
        code: 0,
        data: getImages(page),
      };
    },
  },
  // 获取ai扮演的角色prompt 和 placeholder和背景图片imgUrl
  // 一页10条
  {
    url: "/api/ai-role",
    method: "get",
    response: ({ query }) => {
      return {
        code: 0,
        data: getAiRole(query.page),
      };
    },
  },
  // 登录
  {
    url: "/api/login",
    method: "post",
    response: (req) => {
      const { username, password } = req.body;
      if (username !== "admin" || password !== "123456") {
        return {
          code: 1,
          message: "用户名或密码错误",
        };
      }
      const token = sign(
        {
          user: {
            id: "001",
            username: "admin",
          },
        },
        secret,
        { expiresIn: "86400" }
      );
      return {
        token,
        data: {
          id: "001",
          username: "admin",
        },
      };
    },
  },
  // 检查登录状态
  {
    url: "/api/user",
    method: "GET",
    response: (req) => {
      const authHeader = req.headers["authorization"].split(" ")[1];
      //console.log(authHeader);
      const token = authHeader;
      //console.log(token);
      if (!token) {
        return { code: 1, message: "未找到 token" };
      }

      try {
        // const decoded = `fsfsdsfd`
        // console.log(token);
        // const tokenn =
        //  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMDAxIiwidXNlcm5hbWUiOiJhZG1pbiJ9LCJpYXQiOjE3NTMyNDQwMjYsImV4cCI6MTc1MzI0NDExMn0.WVEf6RkWnYHvaJL6T7Me1qFB2HXskN5hh4Gq38sxhU0";

        console.log(token);
        const data = decode(token);
        // console.log(jwt.decode);
        console.log(data, "AAA");

        return {
          code: 0,
          message: "获取用户信息成功",
          username: data.user.username,
        };
      } catch (err) {
        return { code: 1, message: "token验证失败", err };
      }
    },
  },
  // 注册
  {
    url: "/api/register",
    method: "post",
    response: (req) => {
      const { username, password } = req.body;

      // 基本验证
      if (!username || !password) {
        return {
          code: 1,
          message: "用户名和密码不能为空",
        };
      }

      if (username.length < 3) {
        return {
          code: 1,
          message: "用户名至少3个字符",
        };
      }

      if (password.length < 6) {
        return {
          code: 1,
          message: "密码至少6个字符",
        };
      }

      // 模拟用户已存在的情况（如果用户名是admin）
      if (username === "admin") {
        return {
          code: 1,
          message: "用户名已存在",
        };
      }

      // 注册成功，返回token和用户信息（与登录接口格式一致）
      const token = sign(
        {
          user: {
            id: Mock.Random.id(), // 生成随机ID
            username: username,
          },
        },
        secret,
        { expiresIn: "86400" }
      );

      return {
        code: 0,
        token,
        data: {
          id: Mock.Random.id(),
          username: username,
        },
      };
    },
  },
  // 对话统计上报
  {
    url: "/api/analytics/conversation",
    method: "post",
    response: (req) => {
      const data = req.body;
      console.log("对话统计上报:", data);

      // 模拟偶尔的网络错误
      if (Math.random() < 0.1) {
        return {
          code: 1,
          message: "网络错误，上报失败",
        };
      }

      return {
        code: 0,
        message: "对话统计上报成功",
        data: {
          reportId: Mock.Random.id(),
          timestamp: Date.now(),
        },
      };
    },
  },
  // 页面离开统计上报
  {
    url: "/api/analytics/page-leave",
    method: "post",
    response: (req) => {
      const data = req.body;
      console.log("页面离开统计上报:", data);

      // 模拟偶尔的网络错误
      if (Math.random() < 0.1) {
        return {
          code: 1,
          message: "网络错误，上报失败",
        };
      }

      return {
        code: 0,
        message: "页面离开统计上报成功",
        data: {
          reportId: Mock.Random.id(),
          timestamp: Date.now(),
        },
      };
    },
  },
  // 批量埋点数据上报
  {
    url: "/api/analytics/batch",
    method: "post",
    response: (req) => {
      const { conversations = [], pageLeaves = [] } = req.body;
      console.log("批量埋点上报:", {
        conversationCount: conversations.length,
        pageLeaveCount: pageLeaves.length,
      });

      // 模拟偶尔的网络错误
      if (Math.random() < 0.05) {
        return {
          code: 1,
          message: "批量上报失败",
        };
      }

      return {
        code: 0,
        message: "批量上报成功",
        data: {
          reportId: Mock.Random.id(),
          processedCount: conversations.length + pageLeaves.length,
          timestamp: Date.now(),
        },
      };
    },
  },
];
