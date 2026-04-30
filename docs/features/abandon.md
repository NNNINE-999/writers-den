# 文章遗弃

## 功能

作者不想保留一篇文章但又不想删除，可以「遗弃」它。文章归属权自动转移给站内秘书「陈文逸」，由他"收养"在站内。

## 遗弃流程

1. 作者在文章详情页点击「遗弃」
2. 二次确认："遗弃？" → 遗弃 / 取消
3. `abandonArticle` 执行：
   - 将 `authorId` 改为陈文逸的 ID
   - 标记 `abandoned = "1"`
   - 设置 `anonymous = "0"`（解除匿名）
4. 文章从原主人主页消失，出现在陈文逸主页 `/users/陈文逸`
5. 首页展示作者为「陈文逸 · 收养」
6. 文章详情页显示「已遗弃」标签

## 管理权限

- 管理员（邮箱 `3371095643@qq.com`）可以编辑或删除陈文逸名下的遗弃文章
- 权限检查在 `updateArticle` 和 `deleteArticle` 中：`authorId !== user.id && !(user.role === "admin" && abandoned === "1")`

## 实现

- 组件：`src/components/AbandonArticleButton.tsx`
- Server Action：`src/app/articles/actions.ts` — `abandonArticle`
- 陈文逸账号首次遗弃时自动创建：`ensureChenwenyiExists()`
- 数据库字段：`articles.abandoned` — `"0"`（正常）或 `"1"`（已遗弃），默认 `"0"`
