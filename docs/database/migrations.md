# 数据库迁移记录

使用 `drizzle-kit push` 进行 schema 同步（无 migration 文件）。

## 变更记录

### 2026-05-01 — 添加 `abandoned` 字段

`articles` 表新增 `abandoned` TEXT NOT NULL DEFAULT '0'

### 2026-05-01 — 添加 `anonymous` 字段

`articles` 表新增 `anonymous` TEXT NOT NULL DEFAULT '0'

### 2026-04-30 — 初始 Schema

首次 `drizzle-kit push`，创建全部 7 张表。
