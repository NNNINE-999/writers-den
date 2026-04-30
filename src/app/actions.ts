"use server";

import { v4 as uuid } from "uuid";
import { db } from "@/../db";
import { users, verificationCodes } from "@/../db/schema";
import { eq, and, gt } from "drizzle-orm";
import {
  hashPassword,
  verifyPassword,
  createSession,
  deleteSession,
} from "@/lib/auth";
import { registerSchema, loginSchema } from "@/lib/validations";
import { sendVerificationCode } from "@/lib/email";
import { sql } from "drizzle-orm";

interface AuthState {
  errors: Record<string, string[]>;
  success?: boolean;
}

export async function sendCodeAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  if (!email || !email.includes("@")) {
    return { errors: { email: ["请输入有效的邮箱地址"] } };
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const id = uuid();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  await db.insert(verificationCodes).values({
    id,
    email: email.toLowerCase(),
    code,
    expiresAt,
  });

  const result = await sendVerificationCode(email, code);
  if (!result.success) {
    return { errors: { _form: [result.error ?? "邮件发送失败，请检查 SMTP 配置"] } };
  }

  return { errors: {}, success: true };
}

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const raw = {
    email: formData.get("email"),
    username: (formData.get("username") as string).trim(),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    qq: formData.get("qq") || undefined,
    code: formData.get("code") || undefined,
  };

  const result = registerSchema.safeParse(raw);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const { email, username, password, code } = result.data;

  // 验证邮箱验证码
  const codes = await db
    .select()
    .from(verificationCodes)
    .where(
      and(
        eq(verificationCodes.email, email.toLowerCase()),
        eq(verificationCodes.code, code ?? ""),
        eq(verificationCodes.used, "0"),
        gt(verificationCodes.expiresAt, new Date().toISOString())
      )
    );
  if (codes.length === 0) {
    return { errors: { code: ["验证码错误或已过期"] } };
  }
  await db
    .update(verificationCodes)
    .set({ used: "1" })
    .where(eq(verificationCodes.id, codes[0].id));

  const [existingEmail, existingUsername] = await Promise.all([
    db.select({ id: users.id }).from(users).where(eq(users.email, email)),
    db.select({ id: users.id }).from(users).where(eq(users.username, username)),
  ]);

  if (existingEmail.length > 0) {
    return { errors: { email: ["该邮箱已被注册"] } };
  }
  if (existingUsername.length > 0) {
    return { errors: { username: ["该用户名已被使用"] } };
  }

  // 第一个注册的用户自动成为管理员
  const userCount = await db.select({ count: sql<number>`count(*)` }).from(users);
  const role = userCount[0].count === 0 ? "admin" : "user";

  const id = uuid();
  await db.insert(users).values({
    id,
    email: email.toLowerCase(),
    username,
    passwordHash: await hashPassword(password),
    qq: (formData.get("qq") as string) || null,
    role,
    createdAt: new Date().toISOString(),
  });

  await createSession(id);
  return { errors: {}, success: true };
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = loginSchema.safeParse(raw);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const { email, password } = result.data;
  const rows = await db
    .select({ id: users.id, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.email, email.toLowerCase()));

  if (rows.length === 0 || !(await verifyPassword(password, rows[0].passwordHash))) {
    return { errors: { email: ["邮箱或密码错误"] } };
  }

  await createSession(rows[0].id);
  return { errors: {}, success: true };
}

export async function logoutAction() {
  await deleteSession();
}
