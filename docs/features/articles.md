# 文章系统

## 发布文章

- 页面：`src/app/articles/new/page.tsx`
- 表单组件：`src/components/ArticleForm.tsx`
- Server Action：`src/app/articles/actions.ts` — `createArticle`
- 内容编辑器：`@uiw/react-md-editor`，实时预览模式
- 标签：逗号分隔输入，自动创建新标签或关联已有标签

## 文章详情

- 页面：`src/app/articles/[id]/page.tsx`
- 内容渲染：`react-markdown` + `remark-gfm`（`src/components/MarkdownContent.tsx`）
- 显示：标题、作者、时间、标签、Markdown 渲染内容
- 作者可看到「编辑」「遗弃」「删除」三个按钮
- 管理员对已遗弃文章可看到「编辑」「删除」按钮

## 编辑文章

- 页面：`src/app/articles/[id]/edit/page.tsx`
- 复用 `ArticleForm`，预填 `initialTitle`, `initialContent`, `initialTags`, `initialCopyable`, `initialAnonymous`
- Server Action：`updateArticle`
- 仅作者本人或管理员（针对已遗弃文章）可编辑

## 删除文章

- 组件：`src/components/DeleteArticleButton.tsx`
- Server Action：`deleteArticle`
- 两段确认："确认？" → 删除 / 取消
- 仅作者本人或管理员（针对已遗弃文章）可删除

## 一键复制

- 组件：`src/components/CopyButton.tsx`
- 仅在文章标记 `copyable = "1"` 时显示
- 使用 `document.execCommand('copy')` 降级方案，兼容 HTTP 环境（非 HTTPS 下 `navigator.clipboard` 不可用）

## 首页文章流

- 页面：`src/app/page.tsx`（需登录）
- 按时间倒序排列
- 每篇文章显示：标题、摘要（前 180 字符）、作者（匿名/遗弃有特殊处理）、时间（相对时间）、标签（最多 3 个）
- 侧栏：标签云 + 快速入口
