# Writers' Den

一个温暖的中文写作与分享平台。作者可以发布 Markdown 文章，通过标签组织内容，与读者互动评论。

## 角色设定

站内有一位秘书 **陈文逸**（小陈），负责邮件对接和收养被遗弃的文章。详见 [characters/chen-wenyi.md](characters/chen-wenyi.md)。

## 技术栈

| 层 | 选型 |
|---|------|
| 框架 | Next.js 16 (App Router, Turbopack) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS v4 |
| 数据库 | SQLite (Turso / `@libsql/client`) |
| ORM | Drizzle ORM |
| 编辑器 | `@uiw/react-md-editor` |
| 渲染 | `react-markdown` + `remark-gfm` |
| 邮箱 | Nodemailer + QQ SMTP |
| 部署 | Tencent Cloud 轻量服务器 (Ubuntu 24.04) + PM2 + Nginx |

## 页面路由

| 路由 | 说明 |
|------|------|
| `/` | 首页，文章流 + 标签云侧栏（需登录） |
| `/login` | 登录页 |
| `/register` | 注册页（邮箱验证码） |
| `/articles/new` | 发布新文章 |
| `/articles/[id]` | 文章详情 + 评论区 |
| `/articles/[id]/edit` | 编辑文章 |
| `/tags/[slug]` | 标签下文章列表 |
| `/users/[username]` | 用户主页 |
| `/admin` | 管理后台 |

## 功能一览

详见 [features/](features/) 目录：

- [用户认证](features/auth.md) — 注册、登录、邮箱验证码、会话管理
- [文章系统](features/articles.md) — 发布、编辑、删除、Markdown 写作
- [评论](features/comments.md) — 发表评论、删除自己的评论
- [匿名发布](features/anonymous.md) — 隐藏作者身份的发布模式
- [文章遗弃](features/abandon.md) — 不删文、转给陈文逸收养

## 快速开始

```bash
npm install
cp .env.example .env   # 编辑填入 SMTP 配置
npx drizzle-kit push    # 初始化数据库
npm run dev             # http://localhost:3000
```

## 部署

详见 [deployment.md](deployment.md)。
