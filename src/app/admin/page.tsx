import { redirect } from "next/navigation";
import { db } from "@/../db";
import { users } from "@/../db/schema";
import { desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin") redirect("/");

  const allUsers = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      qq: users.qq,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-warm-800 mb-1">管理员面板</h1>
        <p className="text-stone-400 text-sm">共 {allUsers.length} 位注册用户</p>
      </div>

      <div className="bg-white/80 backdrop-blur rounded-2xl border border-warm-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-warm-200 bg-warm-50/50">
                <th className="text-left px-5 py-3 text-stone-500 font-medium">用户名</th>
                <th className="text-left px-5 py-3 text-stone-500 font-medium">邮箱</th>
                <th className="text-left px-5 py-3 text-stone-500 font-medium">QQ</th>
                <th className="text-left px-5 py-3 text-stone-500 font-medium">角色</th>
                <th className="text-left px-5 py-3 text-stone-500 font-medium">注册时间</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((u) => (
                <tr key={u.id} className="border-b border-warm-100 last:border-0 hover:bg-warm-50/30 transition-colors">
                  <td className="px-5 py-3 font-medium text-stone-700">{u.username}</td>
                  <td className="px-5 py-3 text-stone-500">{u.email}</td>
                  <td className="px-5 py-3 text-stone-500">{u.qq || "—"}</td>
                  <td className="px-5 py-3">
                    <span
                      className={
                        u.role === "admin"
                          ? "px-2 py-0.5 text-xs rounded-full bg-warm-600 text-white"
                          : "text-stone-400"
                      }
                    >
                      {u.role === "admin" ? "管理员" : "用户"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-stone-400">
                    {new Date(u.createdAt).toLocaleDateString("zh-CN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
