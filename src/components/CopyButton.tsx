"use client";

import { useState } from "react";

export function CopyButton({ content }: { content: string }) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  function handleCopy() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(content).then(() => {
          setState("copied");
          setTimeout(() => setState("idle"), 1500);
        }).catch(() => setState("error"));
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = content;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setState("copied");
        setTimeout(() => setState("idle"), 1500);
      }
    } catch {
      setState("error");
    }
  }

  return (
    <button
      onClick={handleCopy}
      disabled={state === "error"}
      className="px-4 py-2 text-sm rounded-full border border-warm-200 text-stone-500 hover:bg-warm-50 hover:text-warm-700 hover:border-warm-600 transition-all cursor-pointer"
    >
      {state === "copied" ? "已复制！" : state === "error" ? "复制失败" : "一键复制"}
    </button>
  );
}
