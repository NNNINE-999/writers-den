"use client";

import { startTransition } from "react";
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

  function handleDelete() {
    startTransition(async () => {
      await deleteComment(articleId, commentId);
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-stone-300 hover:text-red-500 transition-colors cursor-pointer"
      title="删除评论"
    >
      &times;
    </button>
  );
}
