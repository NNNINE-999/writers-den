import Link from "next/link";
import { db } from "@/../db";
import { articles, users, tags, articleTags } from "@/../db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { CommentsSection } from "@/components/CommentsSection";
import { CopyButton } from "@/components/CopyButton";
import { DeleteArticleButton } from "@/components/DeleteArticleButton";
import { AbandonArticleButton } from "@/components/AbandonArticleButton";
import { MarkdownContent } from "@/components/MarkdownContent";

interface Props {
  params: Promise<{ id: string }>;
}

async function getArticle(id: string) {
  const result = await db
    .select({
      id: articles.id,
      title: articles.title,
      content: articles.content,
      copyable: articles.copyable,
      anonymous: articles.anonymous,
      abandoned: articles.abandoned,
      authorId: articles.authorId,
      authorName: users.username,
      createdAt: articles.createdAt,
      updatedAt: articles.updatedAt,
    })
    .from(articles)
    .innerJoin(users, eq(articles.authorId, users.id))
    .where(eq(articles.id, id));

  return result[0] ?? null;
}

async function getArticleTags(articleId: string) {
  return db
    .select({ id: tags.id, name: tags.name, slug: tags.slug })
    .from(tags)
    .innerJoin(articleTags, eq(tags.id, articleTags.tagId))
    .where(eq(articleTags.articleId, articleId));
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const [article, user] = await Promise.all([
    getArticle(id),
    getCurrentUser(),
  ]);

  if (!user) redirect("/login");
  if (!article) notFound();

  const articleTags = await getArticleTags(id);
  const isAuthor = user?.id === article.authorId;

  return (
    <article className="max-w-3xl mx-auto">
      {/* 作品头部 */}
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-warm-800 mb-4 leading-tight">
          {article.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-stone-400 flex-wrap">
          {article.anonymous === "1" ? (
            <span className="flex items-center gap-2 text-stone-400 font-medium">
              <span className="w-6 h-6 rounded-full bg-warm-100 flex items-center justify-center text-xs font-bold text-warm-600">
                ?
              </span>
              匿名
            </span>
          ) : (
            <Link
              href={`/users/${article.authorName}`}
              className="flex items-center gap-2 text-warm-700 hover:text-warm-800 font-medium transition-colors"
            >
              <span className="w-6 h-6 rounded-full bg-warm-100 flex items-center justify-center text-xs font-bold text-warm-600">
                {(article.authorName ?? "?")[0].toUpperCase()}
              </span>
              {article.authorName}
            </Link>
          )}
          <span className="text-stone-300">·</span>
          <time>
            {new Date(article.createdAt).toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {article.createdAt !== article.updatedAt && (
            <>
              <span className="text-stone-300">·</span>
              <span className="text-stone-400 italic text-xs">已编辑</span>
            </>
          )}
          {isAuthor && article.abandoned !== "1" && (
            <div className="flex gap-2 ml-auto">
              <Link
                href={`/articles/${id}/edit`}
                className="px-3 py-1 text-xs rounded-full border border-warm-200 text-stone-500 hover:bg-warm-50 hover:text-warm-700 transition-all"
              >
                编辑
              </Link>
              <AbandonArticleButton articleId={id} />
              <DeleteArticleButton articleId={id} />
            </div>
          )}
          {article.abandoned === "1" && (
            <span className="ml-auto text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
              已遗弃
            </span>
          )}
        </div>

        {articleTags.length > 0 && (
          <div className="flex gap-2 mt-4 flex-wrap">
            {articleTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${encodeURIComponent(tag.slug)}`}
                className="text-xs px-3 py-1 rounded-full bg-warm-50 text-warm-700 hover:bg-warm-600 hover:text-white transition-all"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* 作品内容 */}
      <div className="bg-white/95 rounded-2xl border border-warm-200 p-6 sm:p-8 mb-6 shadow-sm">
        <MarkdownContent content={article.content} />
      </div>

      {article.copyable === "1" && (
        <div className="flex justify-end mb-10">
          <CopyButton content={article.content} />
        </div>
      )}

      <CommentsSection articleId={id} user={user} />
    </article>
  );
}
