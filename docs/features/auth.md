# 用户认证

## 注册

- 页面：`src/app/register/page.tsx`
- 校验：`src/lib/validations.ts` — `registerSchema`（Zod）
  - 邮箱：合法 email，最长 255
  - 用户名：2–30 字符，允许字母、数字、下划线、中文 (`/^[a-zA-Z0-9_一-鿿]+$/`)
  - 密码：6–100 字符
  - QQ：可选，5–11 位数字
- 验证码：先调用 `sendCodeAction` 发送邮件，再调用 `registerAction` 完成注册
- 第一个注册的用户自动成为 `admin`
- 密码通过 `bcryptjs` 哈希（cost 12）

## 登录

- 页面：`src/app/login/page.tsx`
- Server Action：`src/app/actions.ts` — `loginAction`
- 邮箱大小写不敏感（注册/登录均 `toLowerCase()`）
- 用户名注册时自动 `trim()`

## 会话管理

- 文件：`src/lib/auth.ts`
- Session ID：UUID v4，存入 cookie `session`
- Cookie 配置：`httpOnly: true, secure: false, sameSite: "lax", path: "/"`, 有效期 30 天
- `secure: false` 是因为当前部署无 HTTPS

## 邮箱验证码

- 邮件内容：`src/lib/email.ts`
- 发送方：QQ 邮箱 SMTP（`SMTP_USER`, `SMTP_PASS` 环境变量）
- 验证码：6 位随机数字，有效期 10 分钟
- 存储表：`verification_codes`，用后标记 `used = "1"`
