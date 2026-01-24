const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Contact API
app.post("/api/contact", async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  if (!firstName || !email || !message) {
    return res.status(400).json({ error: "Please fill all required fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password from Gmail
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `Contact Form Submission from ${firstName} ${lastName || ""}`,
      text: `
        Name: ${firstName} ${lastName || ""}
        Email: ${email}
        Phone: ${phone || "N/A"}
        Message: ${message}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: "Message sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
