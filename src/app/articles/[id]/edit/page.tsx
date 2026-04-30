import { redirect, notFound } from "next/navigation";
import { db } from "@/../db";
import { articles, tags, articleTags } from "@/../db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { ArticleForm } from "@/components/ArticleForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const article = await db
    .select({
      id: articles.id,
      title: articles.title,
      content: articles.content,
      copyable: articles.copyable,
      anonymous: articles.anonymous,
      authorId: articles.authorId,
    })
    .from(articles)
    .where(eq(articles.id, id));

  if (article.length === 0) notFound();
  if (article[0].authorId !== user.id) redirect("/");

  const articleTagNames = await db
    .select({ name: tags.name })
    .from(tags)
    .innerJoin(articleTags, eq(tags.id, articleTags.tagId))
    .where(eq(articleTags.articleId, id));

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">编辑作品</h1>
      <ArticleForm
        initialTitle={article[0].title}
        initialContent={article[0].content}
        initialTags={articleTagNames.map((t) => t.name).join(",")}
        initialCopyable={article[0].copyable === "1"}
        initialAnonymous={article[0].anonymous === "1"}
        articleId={id}
      />
    </div>
  );
}
