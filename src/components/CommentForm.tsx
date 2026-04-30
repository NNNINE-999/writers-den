"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createComment } from "@/app/comments/actions";

export function CommentForm({ articleId }: { articleId: string }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const action = createComment.bind(null, articleId);
  const [state, formAction, pending] = useActionState(action, { errors: {} });

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <form ref={formRef} action={formAction} className="mb-6">
      {state.errors._form && (
        <p className="text-red-500 text-sm mb-2 bg-red-50 px-3 py-1.5 rounded-lg">{state.errors._form[0]}</p>
      )}
      <div className="flex gap-3">
        <textarea
          name="content" rows={2}
          className="flex-1 px-4 py-2.5 bg-white border border-warm-200 rounded-xl text-stone-800 placeholder-stone-300 focus:outline-none transition-all text-sm resize-none"
          placeholder="写下你的评论..."
        />
        <button
          type="submit" disabled={pending}
          className="px-5 py-2.5 bg-warm-600 text-white text-sm rounded-xl hover:bg-warm-700 disabled:opacity-50 transition-all font-medium shadow-sm hover:shadow-md shrink-0"
        >
          {pending ? (
            <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
          ) : "发表"}
        </button>
      </div>
      {state.errors.content && (
        <p className="text-red-500 text-sm mt-1.5">{state.errors.content[0]}</p>
      )}
    </form>
  );
}
