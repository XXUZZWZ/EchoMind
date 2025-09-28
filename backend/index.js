import express from 'express';
import cors from 'cors';
import Mock from 'mockjs';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3001;
const secret = "jwt-demo-secret";

// 中间件
app.use(cors());
app.use(express.json());

// 工具函数
const getImages = (page, pageSize = 10) => {
  return Array.from({ length: pageSize }, (_, i) => ({
    id: `${page}-${i}`,
    height: Mock.Random.integer(300, 600),
    url: Mock.Random.image("300x400", Mock.Random.color(), "#fff", "image"),
  }));
};

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

// API路由
// 搜索页推荐接口
app.get('/api/search', (req, res) => {
  const keyword = req.query.keyword;
  let num = Math.floor(Math.random() * 10);
  let list = [];
  for (let i = 0; i < num; i++) {
    const randomData = Mock.mock({
      title: "@ctitle(3,6)",
    });
    list.push(`${randomData.title} ${keyword}`);
  }
  res.json({
    code: 0,
    data: list,
  });
});

// 搜索热词接口
app.get('/api/hotlist', (req, res) => {
  res.json({
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
  });
});

// 详情页接口
app.get('/api/detail/:id', (req, res) => {
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
  res.json({
    code: 0,
    data: randomData,
  });
});

// 图片含多页分页接口
app.get('/api/images', (req, res) => {
  const page = Number(req.query.page);
  res.json({
    code: 0,
    data: getImages(page),
  });
});

// 获取ai扮演的角色prompt
app.get('/api/ai-role', (req, res) => {
  res.json({
    code: 0,
    data: getAiRole(req.query.page),
  });
});

// 登录
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username !== "admin" || password !== "123456") {
    return res.json({
      code: 1,
      message: "用户名或密码错误",
    });
  }
  const token = jwt.sign(
    {
      user: {
        id: "001",
        username: "admin",
      },
    },
    secret,
    { expiresIn: "86400" }
  );
  res.json({
    token,
    data: {
      id: "001",
      username: "admin",
    },
  });
});

// 检查登录状态
app.get('/api/user', (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.json({ code: 1, message: "未找到 authorization header" });
  }
  
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.json({ code: 1, message: "未找到 token" });
  }

  try {
    const data = jwt.decode(token);
    console.log(data, "AAA");
    res.json({
      code: 0,
      message: "获取用户信息成功",
      username: data.user.username,
    });
  } catch (err) {
    res.json({ code: 1, message: "token验证失败", err });
  }
});

// 注册
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({
      code: 1,
      message: "用户名和密码不能为空",
    });
  }

  if (username.length < 3) {
    return res.json({
      code: 1,
      message: "用户名至少3个字符",
    });
  }

  if (password.length < 6) {
    return res.json({
      code: 1,
      message: "密码至少6个字符",
    });
  }

  if (username === "admin") {
    return res.json({
      code: 1,
      message: "用户名已存在",
    });
  }

  const token = jwt.sign(
    {
      user: {
        id: Mock.Random.id(),
        username: username,
      },
    },
    secret,
    { expiresIn: "86400" }
  );

  res.json({
    code: 0,
    token,
    data: {
      id: Mock.Random.id(),
      username: username,
    },
  });
});

// 对话统计上报
app.post('/api/analytics/conversation', (req, res) => {
  const data = req.body;
  console.log("对话统计上报:", data);

  if (Math.random() < 0.1) {
    return res.json({
      code: 1,
      message: "网络错误，上报失败",
    });
  }

  res.json({
    code: 0,
    message: "对话统计上报成功",
    data: {
      reportId: Mock.Random.id(),
      timestamp: Date.now(),
    },
  });
});

// 页面离开统计上报
app.post('/api/analytics/page-leave', (req, res) => {
  const data = req.body;
  console.log("页面离开统计上报:", data);

  if (Math.random() < 0.1) {
    return res.json({
      code: 1,
      message: "网络错误，上报失败",
    });
  }

  res.json({
    code: 0,
    message: "页面离开统计上报成功",
    data: {
      reportId: Mock.Random.id(),
      timestamp: Date.now(),
    },
  });
});

// 批量埋点数据上报
app.post('/api/analytics/batch', (req, res) => {
  const { conversations = [], pageLeaves = [] } = req.body;
  console.log("批量埋点上报:", {
    conversationCount: conversations.length,
    pageLeaveCount: pageLeaves.length,
  });

  if (Math.random() < 0.05) {
    return res.json({
      code: 1,
      message: "批量上报失败",
    });
  }

  res.json({
    code: 0,
    message: "批量上报成功",
    data: {
      reportId: Mock.Random.id(),
      processedCount: conversations.length + pageLeaves.length,
      timestamp: Date.now(),
    },
  });
});

app.listen(PORT, () => {
  console.log(`Mock backend server running on port ${PORT}`);
});