import nodemailer from "nodemailer";

function getTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error("SMTP 未配置，请在 .env 中设置 SMTP_USER 和 SMTP_PASS");
  }

  return nodemailer.createTransport({
    host: "smtp.qq.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
}

export async function sendVerificationCode(
  to: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Writers' Den · 工作对接",
      text: `验证码：${code}，有效期 10 分钟。`,
      html: `
        <div style="max-width:480px;margin:0 auto;padding:32px;font-family:sans-serif;background:#fefcf8;border-radius:12px;border:1px solid #e8dcc8">
          <h2 style="color:#78350f;margin:0 0 20px">Writers' Den · 工作对接</h2>
          <p style="color:#44403c;margin:0 0 12px;line-height:1.85">你好，</p>
          <p style="color:#44403c;margin:0 0 12px;line-height:1.85">这里是秘书<strong>小陈</strong>，配合你处理这次的文书对接。以下是你的验证码：</p>
          <div style="background:#f5efe6;padding:18px 24px;border-radius:8px;text-align:center;margin-bottom:20px">
            <span style="font-size:30px;font-weight:700;letter-spacing:8px;color:#78350f">${code}</span>
            <p style="color:#92400e;font-size:13px;margin:8px 0 0">有效期 10 分钟</p>
          </div>
          <p style="color:#44403c;margin:0 0 12px;line-height:1.85">后续如果有文档需要归档整理，或者稿件需要流转分发，交给我来安排就好，你专注写作本身即可，我随时准备就位。</p>
          <p style="color:#44403c;margin:0 0 12px;line-height:1.85">有任何需要随时联系。</p>
          <div style="border-top:1px solid #e8dcc8;margin-top:20px;padding-top:16px;color:#78716c;font-size:13px;line-height:1.6">
            <p style="margin:0;font-weight:500;color:#78350f">陈文逸</p>
            <p style="margin:2px 0 0">秘书处 · Writers' Den</p>
            <p style="margin:8px 0 0;color:#a8a29e;font-size:12px">此邮件由系统发送，无需回复。</p>
          </div>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "邮件发送失败";
    return { success: false, error: message };
  }
}
