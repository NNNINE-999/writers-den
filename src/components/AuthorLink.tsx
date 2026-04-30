"use client";

import Link from "next/link";

export function AuthorLink({
  username,
  className,
}: {
  username: string;
  className?: string;
}) {
  return (
    <Link
      href={`/users/${username}`}
      className={className}
      onClick={(e) => e.stopPropagation()}
    >
      <span className="w-5 h-5 rounded-full bg-warm-100 flex items-center justify-center text-[10px] font-bold text-warm-600">
        {(username ?? "?")[0].toUpperCase()}
      </span>
      {username ?? "?"}
    </Link>
  );
}
