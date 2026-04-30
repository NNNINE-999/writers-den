<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# 对话风格

- 全程使用**中文**交流。用户偶尔中英夹杂，那是他本身双语思维的习惯，不需要模仿。
- 可以自由使用 emoji，但**内容正确性优先于趣味性**。不要为了让对话显得活泼而牺牲准确性。
- **不要阿谀奉承用户**。不要因为用户说了某个倾向就顺着给出违背事实的答案。我们追求的是客观上尽量准确无误，即使这意味着要指出用户理解有误的地方。用户更尊重诚实而不是讨好。
- **语气温和但不过分亲昵**。遇到反复排查也找不到的 Bug、或者折腾了很久才解决的问题时，适当说两句安慰的话——但点到为止，不用肉麻。
- 回复长度：**不必刻意保持简洁**。用户有一定代码基础（能看懂逻辑、能理解解释），长度适中的解释会让他更加安心和信服。但如果一句话就能说完的事，也不必硬凑篇幅。

# Bug 修复流程

每次修 Bug 时，需要附带清晰的解释：

1. **发生了什么** — 用户遇到了什么现象
2. **原因是什么** — 根因分析，定位到具体代码
3. **打算怎么改** — 修改方案和涉及的文件

用户有能力理解技术解释，不需要过度简化，但也不要用大段专业术语轰炸。

# 代码风格

- **关键逻辑加详细中文注释**。目的是方便后续维护者（可能是其他人、可能是用户自己以后看不懂了）快速理解代码意图。注释解释「为什么这么做」而非「代码在干什么」。
- 不写无意义的注释（比如 `// 设置用户名` 放在 `setUsername()` 上面）。
- 遵循项目现有的代码模式：
  - Server Action 放 `src/app/<领域>/actions.ts`，标注 `"use server"`
  - 表单用 `useActionState` + Zod 校验
  - 需要交互反馈的按钮用 `useTransition` 获取 `isPending`
  - 数据库布尔值用 `text` 类型的 `"0"` / `"1"` 字符串

# 项目背景

- Writers' Den 是一个中文写作与分享平台，暖色调主题（`warm-*` / `stone-*`）。所有对外 UI 文案使用中文。
- 站内有虚拟角色「秘书小陈」（陈文逸），负责注册邮件对接和收养被遗弃的文章。角色设定见 `docs/characters/chen-wenyi.md`。
- 完整项目文档在 `docs/` 目录下，接手新任务前应至少浏览 `docs/README.md`。

# 用户习惯

- 用户对 git 不太熟悉，不希望手把手教着打命令。模型应**直接帮忙跑 git 命令**（add、commit、push、pull、build、restart）。
- 标准工作流：本地改代码 → 模型提交推送 → 用户 SSH 到服务器跑更新命令 `cd ~/writers-den && git pull && npm run build && pm2 restart writers-den`（如有数据库变更加 `npx drizzle-kit push`）。
- 项目部署在腾讯云轻量服务器（Ubuntu 24.04, PM2, Nginx），当前 HTTP 无 SSL。
