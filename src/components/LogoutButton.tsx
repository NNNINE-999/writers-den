"use client";

import { startTransition } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/app/actions";

export function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    startTransition(async () => {
      await logoutAction();
      router.push("/");
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleLogout}
      className="text-xs text-stone-400 hover:text-red-500 transition-colors cursor-pointer hidden sm:block"
    >
      退出
    </button>
  );
}
