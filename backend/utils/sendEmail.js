import nodemailer from "nodemailer";

export async function sendEmail(to, subject, text, html) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // TLS is automatically handled
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"StockMaster" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text, // Plain text fallback
    html, // HTML content
  });
}
