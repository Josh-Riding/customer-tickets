import nodemailer from "nodemailer";

const { SMTP_PORT, SMTP_HOST, EMAIL_PASS, EMAIL_USER } = process.env;
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export async function sendNotification(bodyToSend) {
  const info = await transporter.sendMail({
    from: `"Ticketeer" <${EMAIL_USER}>`,
    bodyToSend,
  });
}
