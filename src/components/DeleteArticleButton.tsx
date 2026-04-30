"use client";

import { useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteArticle } from "@/app/articles/actions";

export function DeleteArticleButton({ articleId }: { articleId: string }) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  function handleDelete() {
    startTransition(async () => {
      await deleteArticle(articleId);
      router.push("/");
      router.refresh();
    });
  }

  if (showConfirm) {
    return (
      <span className="flex gap-1.5 items-center text-xs">
        <span className="text-stone-400">确认？</span>
        <button onClick={handleDelete} className="text-red-500 hover:text-red-700 font-medium cursor-pointer">删除</button>
        <span className="text-stone-300">/</span>
        <button onClick={() => setShowConfirm(false)} className="text-stone-400 hover:text-stone-600 cursor-pointer">取消</button>
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
