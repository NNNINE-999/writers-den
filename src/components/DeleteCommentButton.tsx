"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteComment } from "@/app/comments/actions";

export function DeleteCommentButton({
  articleId,
  commentId,
}: {
  articleId: string;
  commentId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteComment(articleId, commentId);
      if (result.success) router.refresh();
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-xs px-2 py-0.5 rounded text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      title="删除评论"
    >
      {isPending ? "…" : "删除"}
    </button>
  );
}
