"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { abandonArticle } from "@/app/articles/actions";

export function AbandonArticleButton({ articleId }: { articleId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  function handleAbandon() {
    startTransition(async () => {
      const result = await abandonArticle(articleId);
      if (result.success) router.refresh();
    });
  }

  if (showConfirm) {
    return (
      <span className="flex gap-1.5 items-center text-xs">
        <span className="text-stone-400">遗弃？</span>
        <button onClick={handleAbandon} disabled={isPending} className="text-amber-500 hover:text-amber-700 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">{isPending ? "…" : "遗弃"}</button>
        <span className="text-stone-300">/</span>
        <button onClick={() => setShowConfirm(false)} disabled={isPending} className="text-stone-400 hover:text-stone-600 cursor-pointer disabled:cursor-not-allowed">取消</button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="px-3 py-1 text-xs rounded-full border border-warm-200 text-stone-400 hover:text-amber-500 hover:border-amber-200 transition-all cursor-pointer"
    >
      遗弃
    </button>
  );
}
