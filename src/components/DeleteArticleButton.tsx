"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteArticle } from "@/app/articles/actions";

export function DeleteArticleButton({ articleId }: { articleId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteArticle(articleId);
      if (result.success) {
        router.push("/");
        router.refresh();
      }
    });
  }

  if (showConfirm) {
    return (
      <span className="flex gap-1.5 items-center text-xs">
        <span className="text-stone-400">确认？</span>
        <button onClick={handleDelete} disabled={isPending} className="text-red-500 hover:text-red-700 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">{isPending ? "…" : "删除"}</button>
        <span className="text-stone-300">/</span>
        <button onClick={() => setShowConfirm(false)} disabled={isPending} className="text-stone-400 hover:text-stone-600 cursor-pointer disabled:cursor-not-allowed">取消</button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="px-3 py-1 text-xs rounded-full border border-warm-200 text-stone-400 hover:text-red-500 hover:border-red-200 transition-all cursor-pointer"
    >
      删除
    </button>
  );
}
