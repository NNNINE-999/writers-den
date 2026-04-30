# 数据库表结构

数据库引擎：SQLite (via `@libsql/client`)

ORM：Drizzle ORM，Schema 定义在 `db/schema.ts`

## 表一览

| 表名 | 说明 |
|------|------|
| `users` | 用户账号 |
| `sessions` | 登录会话 |
| `verification_codes` | 邮箱验证码 |
| `articles` | 文章 |
| `tags` | 标签 |
| `article_tags` | 文章-标签关联（多对多） |
| `comments` | 评论 |

## users

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | text (PK) | UUID |
| `email` | text (unique) | 邮箱（小写存储） |
| `username` | text (unique) | 用户名（支持中文） |
| `password_hash` | text | bcrypt 哈希 |
| `avatar_url` | text (nullable) | 头像 URL |
| `qq` | text (nullable) | QQ 号 |
| `role` | text | `"admin"` 或 `"user"`，默认 `"user"` |
| `created_at` | text | ISO 时间戳 |

## sessions

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | text (PK) | UUID |
| `user_id` | text (FK → users.id) | 关联用户 |
| `expires_at` | text | 过期时间（30 天后） |

## verification_codes

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | text (PK) | UUID |
| `email` | text | 邮箱 |
| `code` | text | 6 位数字验证码 |
| `expires_at` | text | 过期时间（10 分钟后） |
| `used` | text | `"0"` 或 `"1"` |

## articles

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | text (PK) | UUID |
| `title` | text | 标题 |
| `content` | text | Markdown 内容 |
| `copyable` | text | `"0"` 或 `"1"`，是否允许一键复制 |
| `anonymous` | text | `"0"` 或 `"1"`，是否匿名 |
| `abandoned` | text | `"0"` 或 `"1"`，是否已遗弃 |
| `author_id` | text (FK → users.id) | 作者 |
| `created_at` | text | ISO 时间戳 |
| `updated_at` | text | ISO 时间戳 |

## tags

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | text (PK) | UUID |
| `name` | text (unique) | 标签名 |
| `slug` | text (unique) | URL slug（中文时保留原文） |

## article_tags

| 字段 | 类型 | 说明 |
|------|------|------|
| `article_id` | text (FK → articles.id) | 文章 ID |
| `tag_id` | text (FK → tags.id) | 标签 ID |

联合唯一索引 `(article_id, tag_id)`。

## comments

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | text (PK) | UUID |
| `content` | text | 评论内容 |
| `author_id` | text (FK → users.id) | 评论者 |
| `article_id` | text (FK → articles.id) | 所属文章 |
| `created_at` | text | ISO 时间戳 |
