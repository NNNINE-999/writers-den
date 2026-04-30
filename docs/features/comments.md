# 评论

## 发表评论

- 组件：`src/components/CommentForm.tsx`
- Server Action：`src/app/comments/actions.ts` — `createComment`
- 校验：`commentSchema` — 1–2000 字符
- 需登录，评论后自动刷新页面（`revalidatePath`）

## 评论列表

- 组件：`src/components/CommentsSection.tsx`
- 按时间倒序排列
- 每条评论显示：作者头像（首字母）、用户名、时间、内容
- 自己的评论旁显示删除按钮

## 删除评论

- 组件：`src/components/DeleteCommentButton.tsx`
- Server Action：`src/app/comments/actions.ts` — `deleteComment`
- 仅评论作者本人可删除
- 使用 `useTransition` 提供 loading 反馈
