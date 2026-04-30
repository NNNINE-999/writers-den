import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { db } from "@/../db";
import { tags, articles, users, articleTags } from "@/../db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const decodedSlug = decodeURIComponent(slug);
  const tag = await db.select({ id: tags.id, name: tags.name }).from(tags).where(eq(tags.slug, decodedSlug));
  if (tag.length === 0) notFound();

  const rows = await db
    .select({
      id: articles.id,
      title: articles.title,
      content: articles.content,
      anonymous: articles.anonymous,
      authorName: users.username,
      createdAt: articles.createdAt,
      tagNames: sql<string>`group_concat(distinct ${tags.name})`.as("tag_names"),
    })
    .from(articles)
    .innerJoin(articleTags, eq(articles.id, articleTags.articleId))
    .innerJoin(users, eq(articles.authorId, users.id))
    .leftJoin(tags, eq(articleTags.tagId, tags.id))
    .where(eq(articleTags.tagId, tag[0].id))
    .groupBy(articles.id)
    .orderBy(desc(articles.createdAt));

  const articleList = rows.map((row) => ({
    ...row,
    authorName: row.anonymous === "1" ? "匿名" : row.authorName,
    tags: row.tagNames ? row.tagNames.split(",") : [],
  }));

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">&#127991;</span>
          <h1 className="text-2xl font-bold text-warm-800">{tag[0].name}</h1>
        </div>
        <p className="text-stone-400 text-sm">共 {articleList.length} 篇作品</p>
      </div>

      {articleList.length === 0 ? (
        <div className="text-center py-20 bg-white/50 rounded-2xl border border-dashed border-warm-200">
          <span className="text-4xl block mb-3">&#128240;</span>
          <p className="text-stone-400">该标签下暂无作品</p>
        </div>
      ) : (
        <div className="space-y-4">
          {articleList.map((article) => {
            const summary = article.content.slice(0, 180).replace(/[#*`\n]/g, " ").trim();
            return (
              <article
                key={article.id}
                className="group bg-white/95 rounded-2xl border border-warm-200 hover:border-warm-600 hover:shadow-lg transition-all duration-300"
              >
                <Link href={`/articles/${article.id}`} className="block p-5 sm:p-6">
                  <h2 className="text-lg font-bold text-stone-800 group-hover:text-warm-700 transition-colors mb-2 line-clamp-1">
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
                    <time>{new Date(article.createdAt).toLocaleDateString("zh-CN")}</time>
                    {article.tags.length > 0 && (
                      <>
                        <span className="text-stone-300">·</span>
                        <span className="flex gap-1">
                          {article.tags.map((t: string) => (
                            <span key={t} className="px-2 py-0.5 bg-warm-50 text-warm-700 rounded-full text-[11px] font-medium">{t}</span>
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
