"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/app/actions";

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(loginAction, { errors: {} });

  useEffect(() => {
    if (state.success) {
      router.push("/");
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <div className="min-h-[65vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white/95 rounded-2xl border border-warm-200 shadow-lg p-8">
          <div className="text-center mb-8">
            <span className="text-4xl block mb-3">&#128221;</span>
            <h1 className="text-2xl font-bold text-warm-800">欢迎回来</h1>
            <p className="text-stone-400 text-sm mt-1">登录你的 Writers&apos; Den 账号</p>
          </div>

          <form action={formAction} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-600 mb-1.5">
                邮箱
              </label>
              <input
                id="email" name="email" type="email" autoComplete="email"
                className="w-full px-4 py-2.5 bg-warm-50 border border-warm-200 rounded-xl text-stone-800 placeholder-stone-300 focus:outline-none transition-all"
                placeholder="your@email.com"
              />
              {state.errors?.email && (
                <p className="text-red-500 text-sm mt-1.5">{state.errors.email[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-600 mb-1.5">
                密码
              </label>
              <input
                id="password" name="password" type="password" autoComplete="current-password"
                className="w-full px-4 py-2.5 bg-warm-50 border border-warm-200 rounded-xl text-stone-800 focus:outline-none transition-all"
                placeholder="输入密码"
              />
              {state.errors?.password && (
                <p className="text-red-500 text-sm mt-1.5">{state.errors.password[0]}</p>
              )}
            </div>

            <button
              type="submit" disabled={pending}
              className="w-full py-2.5 bg-warm-600 text-white rounded-xl hover:bg-warm-700 disabled:opacity-50 transition-all font-medium shadow-sm hover:shadow-md"
            >
              {pending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                  登录中...
                </span>
              ) : "登录"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-stone-400 mt-6">
          还没有账号？{" "}
          <Link href="/register" className="text-warm-600 hover:text-warm-700 font-medium transition-colors">
            立即注册 &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
}
