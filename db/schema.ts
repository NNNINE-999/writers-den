import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  avatarUrl: text("avatar_url"),
  qq: text("qq"),
  role: text("role").notNull().default("user"),
  createdAt: text("created_at").notNull(),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: text("expires_at").notNull(),
});

export const verificationCodes = sqliteTable("verification_codes", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  code: text("code").notNull(),
  expiresAt: text("expires_at").notNull(),
  used: text("used").notNull().default("0"),
});

export const articles = sqliteTable("articles", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  copyable: text("copyable").notNull().default("0"),
  anonymous: text("anonymous").notNull().default("0"),
  abandoned: text("abandoned").notNull().default("0"),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const tags = sqliteTable("tags", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

export const articleTags = sqliteTable(
  "article_tags",
  {
    articleId: text("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => ({
    uniquePair: uniqueIndex("article_tag_unique").on(
      table.articleId,
      table.tagId
    ),
  })
);

export const comments = sqliteTable("comments", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  articleId: text("article_id")
    .notNull()
    .references(() => articles.id, { onDelete: "cascade" }),
  createdAt: text("created_at").notNull(),
});
