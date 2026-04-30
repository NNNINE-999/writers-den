"use client";

import { useState } from "react";

export function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={handleCopy}
      className="px-4 py-2 text-sm rounded-full border border-warm-200 text-stone-500 hover:bg-warm-50 hover:text-warm-700 hover:border-warm-600 transition-all cursor-pointer"
    >
      {copied ? "已复制！" : "一键复制"}
    </button>
  );
}
