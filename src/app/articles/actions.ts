"use server";

import { v4 as uuid } from "uuid";
import { db } from "@/../db";
import { articles, tags, articleTags } from "@/../db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { articleSchema } from "@/lib/validations";

interface ArticleState {
  errors: Record<string, string[]>;
  success?: boolean;
  id?: string;
}

async function resolveTags(tagNames: string[]) {
  const result: string[] = [];
  for (const name of tagNames) {
    const trimmed = name.trim();
    if (!trimmed) continue;
    const slug = trimmed.toLowerCase().replace(/\s+/g, "-");
    const existing = await db.select({ id: tags.id }).from(tags).where(eq(tags.slug, slug));
    if (existing.length > 0) {
      result.push(existing[0].id);
    } else {
      const id = uuid();
      await db.insert(tags).values({ id, name: trimmed, slug });
      result.push(id);
    }
  }
  return result;
}

export async function createArticle(_prev: ArticleState, formData: FormData): Promise<ArticleState> {
  const user = await getCurrentUser();
  if (!user) return { errors: { _form: ["请先登录"] } };

  const raw = {
    title: formData.get("title"),
    content: formData.get("content"),
    tags: (formData.get("tags") as string)?.split(",").filter(Boolean) ?? [],
    copyable: formData.get("copyable") === "1" ? "1" : "0",
    anonymous: formData.get("anonymous") === "1" ? "1" : "0",
  };

  const result = articleSchema.safeParse(raw);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const { title, content, copyable } = result.data;
  const id = uuid();
  const now = new Date().toISOString();
  const tagIds = await resolveTags(raw.tags);

  await db.insert(articles).values({ id, title, content, copyable, anonymous: raw.anonymous, authorId: user.id, createdAt: now, updatedAt: now });
  if (tagIds.length > 0) {
    await db.insert(articleTags).values(tagIds.map((tagId) => ({ articleId: id, tagId })));
  }

  return { errors: {}, success: true, id };
}

export async function updateArticle(id: string, _prev: ArticleState, formData: FormData): Promise<ArticleState> {
  const user = await getCurrentUser();
  if (!user) return { errors: { _form: ["请先登录"] } };

  const row = await db.select({ authorId: articles.authorId }).from(articles).where(eq(articles.id, id));
  if (row.length === 0 || row[0].authorId !== user.id) {
    return { errors: { _form: ["无权编辑此作品"] } };
  }

  const raw = {
    title: formData.get("title"),
    content: formData.get("content"),
    tags: (formData.get("tags") as string)?.split(",").filter(Boolean) ?? [],
    copyable: formData.get("copyable") === "1" ? "1" : "0",
    anonymous: formData.get("anonymous") === "1" ? "1" : "0",
  };

  const result = articleSchema.safeParse(raw);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const { title, content, copyable } = result.data;
  const tagIds = await resolveTags(raw.tags);

  await db.update(articles).set({ title, content, copyable, anonymous: raw.anonymous, updatedAt: new Date().toISOString() }).where(eq(articles.id, id));
  await db.delete(articleTags).where(eq(articleTags.articleId, id));
  if (tagIds.length > 0) {
    await db.insert(articleTags).values(tagIds.map((tagId) => ({ articleId: id, tagId })));
  }

  return { errors: {}, success: true };
}

export async function deleteArticle(id: string) {
  const user = await getCurrentUser();
  if (!user) return { success: false };
  const row = await db.select({ authorId: articles.authorId }).from(articles).where(eq(articles.id, id));
  if (row.length === 0 || row[0].authorId !== user.id) return { success: false };
  await db.delete(articles).where(eq(articles.id, id));
  return { success: true };
}
