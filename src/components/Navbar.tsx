import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "./LogoutButton";

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <nav className="relative bg-white/95 border-b border-warm-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-warm-800 hover:text-warm-600 transition-colors">
            <span className="text-2xl" role="img" aria-label="pen">&#9998;</span>
            Writers&apos; Den
          </Link>
          <Link
            href="/"
            className="hidden sm:block text-sm text-stone-500 hover:text-warm-700 transition-colors font-medium"
          >
            发现
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {user ? (
            <>
              <Link
                href="/articles/new"
                className="flex items-center gap-1.5 text-sm bg-warm-600 text-white px-4 py-2 rounded-full hover:bg-warm-700 transition-all shadow-sm hover:shadow-md"
              >
                <span className="text-lg leading-none">+</span>
                <span className="hidden sm:inline">进行创作</span>
              </Link>
              <Link
                href={`/users/${user.username}`}
                className="flex items-center gap-2 text-sm text-stone-600 hover:text-warm-700 transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-warm-100 flex items-center justify-center text-xs font-bold text-warm-700">
                  {user.username[0].toUpperCase()}
                </span>
                <span className="hidden sm:inline">{user.username}</span>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-stone-500 hover:text-warm-700 transition-colors font-medium"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="text-sm bg-warm-600 text-white px-4 py-2 rounded-full hover:bg-warm-700 transition-all shadow-sm hover:shadow-md"
              >
                注册
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
