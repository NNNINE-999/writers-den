"use server";

import { revalidatePath } from "next/cache";
import { v4 as uuid } from "uuid";
import { db } from "@/../db";
import { comments } from "@/../db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { commentSchema } from "@/lib/validations";

interface CommentState {
  errors: Record<string, string[]>;
  success?: boolean;
}

export async function createComment(
  articleId: string,
  _prev: CommentState,
  formData: FormData
): Promise<CommentState> {
  const user = await getCurrentUser();
  if (!user) return { errors: { _form: ["请先登录"] } };

  const result = commentSchema.safeParse({ content: formData.get("content") });
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  await db.insert(comments).values({
    id: uuid(),
    content: result.data.content,
    authorId: user.id,
    articleId,
    createdAt: new Date().toISOString(),
  });

  revalidatePath(`/articles/${articleId}`);
  return { errors: {}, success: true };
}

export async function deleteComment(articleId: string, commentId: string) {
  const user = await getCurrentUser();
  if (!user) return;
  const row = await db.select({ authorId: comments.authorId }).from(comments).where(eq(comments.id, commentId));
  if (row.length > 0 && row[0].authorId === user.id) {
    await db.delete(comments).where(eq(comments.id, commentId));
    revalidatePath(`/articles/${articleId}`);
  }
}
