import express from "express";
import nodemailer from "nodemailer";

const app = express();

// Parse JSON bodies
app.use(express.json());

app.post("/", async (req, res) => {
  const { fname, lname, email, phone, msg } = req.body ?? {};

  if (!fname || !lname || !email || !msg) {
    return res
      .status(400)
      .json({ ok: false, error: "Missing required fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `Cravue Contact <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO ?? process.env.SMTP_USER,
      replyTo: email,
      subject: "New contact form submission",
      text: `Name: ${fname} ${lname}\nEmail: ${email}\nPhone: ${phone ?? ""}\nMessage: ${msg}`,
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Mail send failed", err);
    res.status(500).json({ ok: false, error: "Failed to send message" });
  }
});

// Basic health check
app.get("/", (req, res) => {
  res.json({ ok: true });
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default app;
