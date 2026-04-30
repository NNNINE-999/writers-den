"use client";

import { useActionState, useEffect, useState, startTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerAction, sendCodeAction } from "@/app/actions";

export default function RegisterPage() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(registerAction, { errors: {} });
  const [codeSent, setCodeSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      router.push("/");
      router.refresh();
    }
  }, [state.success, router]);

  function handleSendCode() {
    const email = formRef.current?.querySelector<HTMLInputElement>('input[name="email"]')?.value;
    if (!email || !email.includes("@")) {
      setSendError("请先输入有效的邮箱地址");
      return;
    }
    setSendError("");
    setSending(true);
    const formData = new FormData();
    formData.set("email", email);
    startTransition(async () => {
      const result = await sendCodeAction({ errors: {} }, formData);
      setSending(false);
      if (result.errors?._form) {
        setSendError(result.errors._form[0]);
      } else if (result.errors?.email) {
        setSendError(result.errors.email[0]);
      } else {
        setCodeSent(true);
      }
    });
  }

  return (
    <div className="min-h-[65vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur rounded-2xl border border-warm-200 shadow-lg p-8">
          <div className="text-center mb-8">
            <span className="text-4xl block mb-3">&#9997;</span>
            <h1 className="text-2xl font-bold text-warm-800">加入我们</h1>
            <p className="text-stone-400 text-sm mt-1">创建你的 Writers&apos; Den 账号</p>
          </div>

          <form ref={formRef} action={formAction} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-600 mb-1.5">邮箱</label>
              <input
                id="email" name="email" type="email" autoComplete="email"
                className="w-full px-4 py-2.5 bg-warm-50 border border-warm-200 rounded-xl text-stone-800 placeholder-stone-300 focus:outline-none transition-all"
                placeholder="your@qq.com"
              />
              {state.errors?.email && (
                <p className="text-red-500 text-sm mt-1.5">{state.errors.email[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-stone-600 mb-1.5">验证码</label>
              <div className="flex gap-2">
                <input
                  id="code" name="code" type="text" autoComplete="off"
                  className="flex-1 px-4 py-2.5 bg-warm-50 border border-warm-200 rounded-xl text-stone-800 placeholder-stone-300 focus:outline-none transition-all"
                  placeholder="6 位数字"
                  maxLength={6}
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={sending}
                  className="px-4 py-2.5 bg-warm-100 text-warm-700 rounded-xl hover:bg-warm-200 disabled:opacity-50 transition-all text-sm font-medium whitespace-nowrap cursor-pointer"
                >
                  {sending ? "发送中..." : codeSent ? "已发送" : "发送验证码"}
                </button>
              </div>
              {sendError && <p className="text-red-500 text-sm mt-1.5">{sendError}</p>}
              {state.errors?.code && (
                <p className="text-red-500 text-sm mt-1.5">{state.errors.code[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-stone-600 mb-1.5">用户名</label>
              <input
                id="username" name="username" type="text" autoComplete="username"
                className="w-full px-4 py-2.5 bg-warm-50 border border-warm-200 rounded-xl text-stone-800 placeholder-stone-300 focus:outline-none transition-all"
                placeholder="你的笔名"
              />
              {state.errors?.username && (
                <p className="text-red-500 text-sm mt-1.5">{state.errors.username[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="qq" className="block text-sm font-medium text-stone-600 mb-1.5">
                QQ 号 <span className="text-stone-400 font-normal">（选填）</span>
              </label>
              <input
                id="qq" name="qq" type="text"
                className="w-full px-4 py-2.5 bg-warm-50 border border-warm-200 rounded-xl text-stone-800 placeholder-stone-300 focus:outline-none transition-all"
                placeholder="方便我们联系你"
              />
              {state.errors?.qq && (
                <p className="text-red-500 text-sm mt-1.5">{state.errors.qq[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-600 mb-1.5">密码</label>
              <input
                id="password" name="password" type="password" autoComplete="new-password"
                className="w-full px-4 py-2.5 bg-warm-50 border border-warm-200 rounded-xl text-stone-800 placeholder-stone-300 focus:outline-none transition-all"
                placeholder="至少 6 个字符"
              />
              {state.errors?.password && (
                <p className="text-red-500 text-sm mt-1.5">{state.errors.password[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-600 mb-1.5">
                确认密码
              </label>
              <input
                id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password"
                className="w-full px-4 py-2.5 bg-warm-50 border border-warm-200 rounded-xl text-stone-800 placeholder-stone-300 focus:outline-none transition-all"
                placeholder="再输一遍密码"
              />
              {state.errors?.confirmPassword && (
                <p className="text-red-500 text-sm mt-1.5">{state.errors.confirmPassword[0]}</p>
              )}
            </div>

            {state.errors._form && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">
                {state.errors._form[0]}
              </div>
            )}

            <button
              type="submit" disabled={pending}
              className="w-full py-2.5 bg-warm-600 text-white rounded-xl hover:bg-warm-700 disabled:opacity-50 transition-all font-medium shadow-sm hover:shadow-md mt-2 cursor-pointer"
            >
              {pending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                  注册中...
                </span>
              ) : "注册"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-stone-400 mt-6">
          已有账号？{" "}
          <Link href="/login" className="text-warm-600 hover:text-warm-700 font-medium transition-colors">
            立即登录 &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
}
