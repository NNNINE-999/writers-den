import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/../db";
import { articles, users, tags, articleTags } from "@/../db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { AuthorLink } from "@/components/AuthorLink";

async function getArticles() {
  const rows = await db
    .select({
      id: articles.id,
      title: articles.title,
      content: articles.content,
      anonymous: articles.anonymous,
      authorId: articles.authorId,
      authorName: users.username,
      createdAt: articles.createdAt,
      tagNames: sql<string>`group_concat(distinct ${tags.name})`.as("tag_names"),
    })
    .from(articles)
    .leftJoin(users, eq(articles.authorId, users.id))
    .leftJoin(articleTags, eq(articles.id, articleTags.articleId))
    .leftJoin(tags, eq(articleTags.tagId, tags.id))
    .groupBy(articles.id)
    .orderBy(desc(articles.createdAt));

  return rows.map((row) => ({
    ...row,
    authorName: row.anonymous === "1" ? "匿名" : row.authorName,
    tags: row.tagNames ? row.tagNames.split(",") : [],
  }));
}

async function getTagCloud() {
  return db
    .select({
      id: tags.id,
      name: tags.name,
      slug: tags.slug,
      count: sql<number>`count(${articleTags.articleId})`.as("count"),
    })
    .from(tags)
    .leftJoin(articleTags, eq(tags.id, articleTags.tagId))
    .groupBy(tags.id)
    .orderBy(desc(sql`count`));
}

export default async function HomePage() {
  const [articleList, tagCloud, user] = await Promise.all([
    getArticles(),
    getTagCloud(),
    getCurrentUser(),
  ]);

  if (!user) redirect("/login");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8">
      <div>
        {/* 欢迎横幅 */}
        <div className="mb-8 bg-white/90 rounded-2xl p-6 border border-warm-200 shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold text-warm-800 mb-2">
            欢迎回来，{user.username} &#128075;
          </h1>
          <p className="text-stone-500">今天想要分享些什么？</p>
        </div>

        {articleList.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-2xl border border-dashed border-warm-200">
            <span className="text-5xl block mb-4">&#128236;</span>
            <p className="text-lg text-stone-400 mb-2">还没有作品</p>
            <p className="text-sm text-stone-300 mb-4">成为第一个分享的人吧</p>
            {user && (
              <Link
                href="/articles/new"
                className="inline-block px-4 py-2 bg-warm-600 text-white rounded-full text-sm hover:bg-warm-700 transition"
              >
                写第一篇作品
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {articleList.map((article, i) => {
              const summary = article.content.slice(0, 180).replace(/[#*`\n]/g, " ").trim();
              return (
                <article
                  key={article.id}
                  className="bg-white/95 rounded-2xl border border-warm-200 hover:border-warm-600 hover:shadow-lg transition-all duration-300"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <Link href={`/articles/${article.id}`} className="block p-5 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold text-stone-800 group-hover:text-warm-700 transition-colors mb-2 line-clamp-1">
                      {article.title}
                    </h2>
                    <p className="text-stone-500 text-sm leading-relaxed mb-4 line-clamp-2">
                      {summary || article.content.slice(0, 180)}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-stone-400 flex-wrap">
                      <span className="flex items-center gap-1.5 text-warm-700 font-medium">
                        <span className="w-5 h-5 rounded-full bg-warm-100 flex items-center justify-center text-[10px] font-bold text-warm-600">
                          {(article.authorName ?? "?")[0].toUpperCase()}
                        </span>
                        {article.authorName}
                      </span>
                      <span className="text-stone-300">·</span>
                      <time>
                        {(() => {
                          const d = new Date(article.createdAt);
                          const now = new Date();
                          const diff = now.getTime() - d.getTime();
                          const mins = Math.floor(diff / 60000);
                          if (mins < 60) return `${mins || 1} 分钟前`;
                          const hours = Math.floor(mins / 60);
                          if (hours < 24) return `${hours} 小时前`;
                          const days = Math.floor(hours / 24);
                          if (days < 30) return `${days} 天前`;
                          return d.toLocaleDateString("zh-CN");
                        })()}
                      </time>
                      {article.tags.length > 0 && (
                        <>
                          <span className="text-stone-300">·</span>
                          <span className="flex gap-1.5 flex-wrap">
                            {article.tags.slice(0, 3).map((tag: string) => (
                              <span
                                key={tag}
                                className="inline-block px-2 py-0.5 bg-warm-50 text-warm-700 rounded-full text-[11px] font-medium"
                              >
                                {tag}
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

      {/* 侧栏 */}
      <aside className="space-y-6">
        {/* 标签云 */}
        <div className="bg-white/90 rounded-2xl border border-warm-200 p-5 sticky top-24 shadow-sm">
          <h3 className="font-semibold text-stone-700 mb-4 flex items-center gap-2">
            <span>&#127991;</span> 标签
          </h3>
          {tagCloud.length === 0 ? (
            <p className="text-sm text-stone-400">暂无标签</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tagCloud.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tags/${encodeURIComponent(tag.slug)}`}
                  className="group flex items-center gap-1 text-sm px-3 py-1.5 rounded-full bg-warm-50 text-stone-600 hover:bg-warm-600 hover:text-white transition-all duration-200"
                >
                  {tag.name}
                  <span className="text-[11px] text-stone-400 group-hover:text-warm-100 transition-colors">
                    {tag.count}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 快速入口 */}
        <div className="bg-white/90 rounded-2xl border border-warm-200 p-5 shadow-sm">
          <h3 className="font-semibold text-stone-700 mb-3 text-sm">快速入口</h3>
          <div className="space-y-2">
            <Link
              href="/articles/new"
              className="block text-sm text-stone-500 hover:text-warm-700 transition-colors"
            >
              &#9998; 进行创作
            </Link>
            <Link
              href="/"
              className="block text-sm text-stone-500 hover:text-warm-700 transition-colors"
            >
              &#128269; 浏览最新
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
