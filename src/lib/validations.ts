import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .email("请输入有效的邮箱地址")
    .max(255),
  username: z
    .string()
    .min(2, "用户名至少 2 个字符")
    .max(30, "用户名最多 30 个字符")
    .regex(/^[a-zA-Z0-9_一-鿿]+$/, "用户名只能包含字母、数字、下划线和中文"),
  password: z
    .string()
    .min(6, "密码至少 6 个字符")
    .max(100),
  confirmPassword: z.string(),
  qq: z
    .string()
    .regex(/^\d{5,11}$/, "请输入正确的QQ号")
    .optional()
    .or(z.literal("")),
  code: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "两次密码不一致",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(1, "请输入密码"),
});

export const articleSchema = z.object({
  title: z.string().min(1, "请输入标题").max(200),
  content: z.string().min(1, "请输入内容"),
  tags: z.array(z.string()).default([]),
  copyable: z.string().default("0"),
});

export const commentSchema = z.object({
  content: z.string().min(1, "请输入评论内容").max(2000),
});
