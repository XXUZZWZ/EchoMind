# EchoMind

> 一款面向移动端的 AI 角色闲聊应用，支持多角色闲聊、流式回复渲染与自定义角色背景（集成 Coze 工作流）。前端基于 React 18 + TypeScript + Vite 构建。

## 功能特性

- 多角色闲聊：首页轮播不同 AI 角色，按角色维度维护独立会话与历史聚合
- 流式对话：接入 DeepSeek，ReadableStream 增量渲染，弱网自动回退非流式
- 角色发布：支持用户创建角色，联动背景生成组件，生成结果自动回填与持久化
- 搜索与探索：热门与联想建议（Mock 接口），便于快速发现角色
- 登录与鉴权：受限路由登录保护，登录后回跳上次意图页
- 移动端体验：pxtorem + lib-flexible，自定义主题（明/暗），背景图预加载与骨架屏

## 技术栈

- 框架与语言：React 18、TypeScript、Vite
- 路由与状态：React Router、Zustand
- UI 与适配：React Vant、PostCSS + postcss-pxtorem、lib-flexible、Iconfont
- 网络与工具：Axios、vite-plugin-mock、ESLint 9 + typescript-eslint
- LLM 接入：DeepSeek（主通道，支持流式）、Kimi（备选）；Coze 工作流用于自定义背景生成

## 目录结构（关键部分）

```
ChitChat/
├─ README.md                # 本文档
├─ 产品设计.md / 详情.md       # 产品与简历说明
├─ frontend/                # 前端项目根目录（Vite）
│  ├─ index.html
│  ├─ vite.config.ts
│  ├─ package.json
│  ├─ mock/                 # 本地 Mock 数据
│  └─ src/
│     ├─ main.tsx / App.tsx
│     ├─ layout/            # MainLayout / PureLayout
│     ├─ pages/             # home / message / publish / search / account 等
│     ├─ components/        # ChatArea / BackgroundGenerator / MarkdownRenderer 等
│     ├─ store/             # zustand stores（user/aiRole/search）
│     ├─ api/               # axios 封装与模块 API（user/search/ai-role）
│     ├─ llm/               # 模型调用封装（流式/非流式）
│     └─ utils/             # LocalStorageUtil / ChatHistoryUtil 等
```

## 环境变量

在 `frontend/` 根目录创建 `.env.local`（或 `.env`）：

```
VITE_API_URL=http://localhost:5173
VITE_DEEPSEEK_API_KEY=你的DeepSeekKey
VITE_KIMI_API_KEY=可选：你的KimiKey
```

说明：

- `VITE_API_URL` 为 Axios 基础地址；使用本地 Mock 时可保持默认
- 若未配置 `VITE_DEEPSEEK_API_KEY`，流式对话将不可用（组件内会自动回退到非流式）

## 快速开始

```bash
# 进入前端工程目录
cd chitchat

# 安装依赖（推荐 pnpm）
pnpm install

# 开发调试（默认启用本地 Mock）
pnpm dev

# 生产构建
pnpm build

# 本地预览
pnpm preview
```

## Mock 使用说明

- 已集成 `vite-plugin-mock`，默认在开发环境启用，Mock 文件位于 `chitchat/mock/`
- 提供搜索、热门、用户与角色等基础模拟接口，便于无后端时快速联调
- 切换到真实接口：配置 `VITE_API_URL` 指向后端网关，并在 `api/` 层按需调整路径

## 关键实现

- 流式对话：`components/ChatArea` 使用 `fetch + ReadableStream` 解析增量内容；`llm/index.ts` 提供统一调用与非流式回退
- 状态管理：`store/` 使用 Zustand 维护用户/搜索/角色与加载态；本地持久化基于 `LocalStorageUtil`
- 鉴权与守卫：`components/RequireAuth` 保护受限路由，登录后回跳到来源页

## 脚本命令（frontend/package.json）

- `pnpm dev`：启动开发服务
- `pnpm build`：生产构建
- `pnpm preview`：本地预览构建产物
- `pnpm lint`：代码规范检查（ESLint 9）

## 注意事项

- 环境变量需以 `VITE_` 前缀暴露给前端使用
- 若使用流式对话，请确保网络可达 DeepSeek API；弱网/超时会自动回退非流式
- Axios 响应拦截器将返回规约后的数据体（`res` 即服务端 `data`），调用方避免重复 `.data`

欢迎二次开发与反馈。
