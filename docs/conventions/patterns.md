# 开发约定

## UI 语言

所有面向用户的文案使用**中文**。

## 样式约定

- 配色：暖色系，自定义 CSS 变量见 `src/app/globals.css`
  - `warm-50` ~ `warm-800`：米白到深棕
  - `stone-*`：正文和次要文本
- 卡片：`bg-white/95 rounded-2xl border border-warm-200`
- 主按钮：`bg-warm-600 text-white rounded-full`
- 移动端触控：全局 `touch-action: manipulation`
- 禁用 `backdrop-blur`：移动端性能问题
- 导航栏 Link 全部加 `prefetch={false}`：减少移动端延迟

## Server Action 模式

- 表单使用 `useActionState(action, { errors: {} })` + `useTransition` 的 `isPending`
- 非表单操作（删除、遗弃）使用 `useTransition().startTransition` + 自定义确认 UI
- Server Action 放在 `src/app/<领域>/actions.ts`，标注 `"use server"`
- 校验用 Zod schema（`src/lib/validations.ts`）

## 数据库

- 所有字段均为 `text` 类型（SQLite 兼容）
- 布尔值用 `"0"` / `"1"` 字符串表示
- 时间用 ISO 字符串存储（`new Date().toISOString()`）
- 外键级联删除：`onDelete: "cascade"`
- 主键均为 UUID v4

## 组件模式

- 服务器组件（默认）负责数据获取，客户端组件负责交互
- 客户端组件标记 `"use client"`
- 需要交互的按钮/表单抽取为独立客户端组件

## URL 编码

- 含中文的 URL 路径（用户名、标签 slug）使用 `encodeURIComponent` 编码
- 对应页面用 `decodeURIComponent` 解码后再查询数据库
