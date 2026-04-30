import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ArticleForm } from "@/components/ArticleForm";

export default async function NewArticlePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">进行创作</h1>
      <ArticleForm />
    </div>
  );
}
