import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { db } from "@/../db";
import { users, articles, tags, articleTags } from "@/../db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function UserPage({ params }: Props) {
  const { username } = await params;
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  const user = await db
    .select({ id: users.id, username: users.username, createdAt: users.createdAt })
    .from(users)
    .where(eq(users.username, username));
  if (user.length === 0) notFound();

  const rows = await db
    .select({
      id: articles.id,
      title: articles.title,
      content: articles.content,
      createdAt: articles.createdAt,
      tagNames: sql<string>`group_concat(distinct ${tags.name})`.as("tag_names"),
    })
    .from(articles)
    .leftJoin(articleTags, eq(articles.id, articleTags.articleId))
    .leftJoin(tags, eq(articleTags.tagId, tags.id))
    .where(eq(articles.authorId, user[0].id))
    .groupBy(articles.id)
    .orderBy(desc(articles.createdAt));

  const articleList = rows.map((row) => ({
    ...row,
    tags: row.tagNames ? row.tagNames.split(",") : [],
  }));

  return (
    <div>
      {/* 用户信息卡片 */}
      <div className="bg-white/80 backdrop-blur rounded-2xl border border-warm-200 p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex items-center gap-4 mb-3">
          <span className="w-16 h-16 rounded-full bg-warm-100 flex items-center justify-center text-2xl font-bold text-warm-600 shadow-inner">
            {user[0].username[0].toUpperCase()}
          </span>
          <div>
            <h1 className="text-2xl font-bold text-warm-800">{user[0].username}</h1>
            <p className="text-stone-400 text-sm mt-0.5">
              加入于 {new Date(user[0].createdAt).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
              })} · {articleList.length} 篇作品
            </p>
          </div>
        </div>
      </div>

      {articleList.length === 0 ? (
        <div className="text-center py-20 bg-white/50 rounded-2xl border border-dashed border-warm-200">
          <span className="text-5xl block mb-3">&#128221;</span>
          <p className="text-stone-400">还没有发布作品</p>
        </div>
      ) : (
        <div className="space-y-4">
          {articleList.map((article) => {
            const summary = article.content.slice(0, 180).replace(/[#*`\n]/g, " ").trim();
            return (
              <article
                key={article.id}
                className="group bg-white/80 backdrop-blur rounded-2xl border border-warm-200 hover:border-warm-600 hover:shadow-lg transition-all duration-300"
              >
                <Link href={`/articles/${article.id}`} className="block p-5 sm:p-6">
                  <h2 className="text-lg font-bold text-stone-800 group-hover:text-warm-700 transition-colors mb-2 line-clamp-1">
                    {article.title}
                  </h2>
                  <p className="text-stone-500 text-sm leading-relaxed mb-4 line-clamp-2">
                    {summary || article.content.slice(0, 180)}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-stone-400 flex-wrap">
                    <time>{new Date(article.createdAt).toLocaleDateString("zh-CN")}</time>
                    {article.tags.length > 0 && (
                      <>
                        <span className="text-stone-300">·</span>
                        <span className="flex gap-1">
                          {article.tags.map((t: string) => (
                            <span key={t} className="px-2 py-0.5 bg-warm-50 text-warm-700 rounded-full text-[11px] font-medium">
                              {t}
                            </span>
                          ))}
                        </span>
                      </>
                    )}
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
