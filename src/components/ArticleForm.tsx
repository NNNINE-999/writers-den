"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createArticle, updateArticle } from "@/app/articles/actions";
import MDEditor from "@uiw/react-md-editor";

interface Props {
  initialTitle?: string;
  initialContent?: string;
  initialTags?: string;
  initialCopyable?: boolean;
  initialAnonymous?: boolean;
  articleId?: string;
}

export function ArticleForm({
  initialTitle = "",
  initialContent = "",
  initialTags = "",
  initialCopyable = false,
  initialAnonymous = false,
  articleId,
}: Props) {
  const router = useRouter();
  const action = articleId
    ? updateArticle.bind(null, articleId)
    : createArticle;

  const [state, formAction, pending] = useActionState(action, { errors: {} });
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    if (state.success) {
      const dest = articleId ? `/articles/${articleId}` : `/articles/${state.id}`;
      router.push(dest);
      router.refresh();
    }
  }, [state.success, state.id, articleId, router]);

  return (
    <form action={formAction} className="space-y-5">
      {state.errors._form && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">
          {state.errors._form[0]}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-stone-600 mb-1.5">标题</label>
        <input
          id="title" name="title" type="text" defaultValue={initialTitle}
          className="w-full px-4 py-2.5 bg-white border border-warm-200 rounded-xl text-stone-800 placeholder-stone-300 focus:outline-none transition-all"
          placeholder="给你的作品起个响亮的名字..."
        />
        {state.errors?.title && (
          <p className="text-red-500 text-sm mt-1.5">{state.errors.title[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-600 mb-1.5">
          内容
        </label>
        <MDEditor
          value={content}
          onChange={(val) => setContent(val ?? "")}
          height={420}
          preview="live"
          visibleDragbar={false}
        />
        <input type="hidden" name="content" value={content} />
        {state.errors?.content && (
          <p className="text-red-500 text-sm mt-1.5">{state.errors.content[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-stone-600 mb-1.5">
          标签 <span className="text-stone-400 font-normal">（用逗号分隔）</span>
        </label>
        <input
          id="tags" name="tags" type="text" defaultValue={initialTags}
          className="w-full px-4 py-2.5 bg-white border border-warm-200 rounded-xl text-stone-800 placeholder-stone-300 focus:outline-none transition-all"
          placeholder="写作, 技术, 生活..."
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox" name="copyable" value="1" defaultChecked={initialCopyable}
          className="w-4 h-4 rounded border-warm-300 text-warm-600 focus:ring-warm-600"
        />
        <span className="text-sm text-stone-600">允许他人复制此作品</span>
      </label>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox" name="anonymous" value="1" defaultChecked={initialAnonymous}
          className="w-4 h-4 rounded border-warm-300 text-warm-600 focus:ring-warm-600"
        />
        <span className="text-sm text-stone-600">匿名发布</span>
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit" disabled={pending}
          className="px-6 py-2.5 bg-warm-600 text-white rounded-xl hover:bg-warm-700 disabled:opacity-50 transition-all font-medium shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer"
        >
          {pending && (
            <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
          )}
          {pending ? "保存中..." : articleId ? "保存修改" : "发布作品"}
        </button>
        <a
          href={articleId ? `/articles/${articleId}` : "/"}
          className="px-6 py-2.5 border border-warm-200 rounded-xl text-stone-500 hover:bg-warm-50 transition-all"
        >
          取消
        </a>
      </div>
    </form>
  );
}
