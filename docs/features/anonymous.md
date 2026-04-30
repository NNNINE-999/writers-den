# 匿名发布

## 功能

文章发布时可勾选「匿名发布」，发布后作者名在所有公开页面显示为「匿名」，头像显示为 `?`，不可点击进入用户主页。

## 实现

- 表单组件：`src/components/ArticleForm.tsx` — checkbox `name="anonymous"`
- Server Action：`createArticle` / `updateArticle` — 写入 `anonymous` 字段
- 数据库字段：`articles.anonymous` — `"0"`（正常）或 `"1"`（匿名），默认 `"0"`
- 首页 `page.tsx`：mapping 阶段 `authorName = row.anonymous === "1" ? "匿名" : row.authorName`
- 文章详情 `articles/[id]/page.tsx`：匿名时渲染纯文本 `「？匿名」`，不使用 Link；头像显示 `?`
- 标签页 `tags/[slug]/page.tsx`：同样处理

## 与遗弃的交互

当匿名文章被遗弃给陈文逸时，`abandonArticle` 自动设 `anonymous = "0"`，解除匿名。因为文章已经换了主人，不再有匿名的必要。
