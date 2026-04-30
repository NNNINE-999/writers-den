import { db } from "@/../db";
import { comments, users } from "@/../db/schema";
import { eq, desc } from "drizzle-orm";
import { CommentForm } from "./CommentForm";
import { DeleteCommentButton } from "./DeleteCommentButton";

interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl: string | null;
  createdAt: string;
}

async function getComments(articleId: string) {
  return db
    .select({
      id: comments.id,
      content: comments.content,
      authorId: comments.authorId,
      authorName: users.username,
      createdAt: comments.createdAt,
    })
    .from(comments)
    .innerJoin(users, eq(comments.authorId, users.id))
    .where(eq(comments.articleId, articleId))
    .orderBy(desc(comments.createdAt));
}

export async function CommentsSection({
  articleId,
  user,
}: {
  articleId: string;
  user: User | null;
}) {
  const commentList = await getComments(articleId);

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-lg font-semibold text-stone-700">评论</h2>
        {commentList.length > 0 && (
          <span className="text-xs px-2 py-0.5 bg-warm-100 text-warm-700 rounded-full font-medium">
            {commentList.length}
          </span>
        )}
      </div>

      {user ? (
        <CommentForm articleId={articleId} />
      ) : (
        <div className="bg-warm-50 rounded-xl p-4 text-center text-sm text-stone-400 mb-6 border border-warm-200 border-dashed">
          <a href="/login" className="text-warm-600 hover:text-warm-700 font-medium transition-colors">
            登录
          </a>{" "}
          后可以发表评论
        </div>
      )}

      <div className="space-y-3 mt-6">
        {commentList.map((comment) => (
          <div
            key={comment.id}
            className="bg-white/90 rounded-xl border border-warm-200 p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm">
                <a
                  href={`/users/${comment.authorName}`}
                  className="flex items-center gap-1.5 font-medium text-warm-700 hover:text-warm-800 transition-colors"
                >
                  <span className="w-5 h-5 rounded-full bg-warm-100 flex items-center justify-center text-[10px] font-bold text-warm-600">
                    {(comment.authorName ?? "?")[0].toUpperCase()}
                  </span>
                  {comment.authorName}
                </a>
                <span className="text-stone-300 text-xs">
                  {new Date(comment.createdAt).toLocaleDateString("zh-CN")}
                </span>
              </div>
              {user?.id === comment.authorId && (
                <DeleteCommentButton
                  articleId={articleId}
                  commentId={comment.id}
                />
              )}
            </div>
            <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
