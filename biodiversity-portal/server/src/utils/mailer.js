import nodemailer from "nodemailer";

const smtpConfig = [
  globalThis.process.env.SMTP_HOST,
  globalThis.process.env.SMTP_PORT,
  globalThis.process.env.SMTP_USER,
  globalThis.process.env.SMTP_PASSWORD,
  globalThis.process.env.SMTP_FROM,
];

export function isEmailConfigured() {
  return smtpConfig.every(Boolean);
}

export async function sendPasswordResetOtp({ email, otp }) {
  if (!isEmailConfigured()) {
    throw new Error("SMTP email delivery is not configured.");
  }

  const transporter = nodemailer.createTransport({
    host: globalThis.process.env.SMTP_HOST,
    port: Number(globalThis.process.env.SMTP_PORT),
    secure: globalThis.process.env.SMTP_SECURE === "true",
    auth: {
      user: globalThis.process.env.SMTP_USER,
      pass: globalThis.process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: globalThis.process.env.SMTP_FROM,
    to: email,
    subject: "Your EndemicLens password reset code",
    text: `Your password reset code is ${otp}. It expires in 10 minutes. If you did not request this, you can ignore this email.`,
    html: `<p>Your EndemicLens password reset code is:</p><p style="font-size:28px;font-weight:700;letter-spacing:8px">${otp}</p><p>This code expires in 10 minutes. If you did not request this, you can ignore this email.</p>`,
  });
}