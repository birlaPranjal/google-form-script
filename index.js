const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const QRCode = require("qrcode");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'koitobanda@gmail.com',
    pass: 'pzqv cgpc izkh xccz',
  },
});

app.get("/", (req, res) => {
    res.send("hello");
});

app.post("/send-ticket", async (req, res) => {
  const { email, formData } = req.body;

  try {
    // Generate QR code
    const qrData = `RSVP Ticket\nEmail: ${email}\nDetails: ${formData.join(", ")}`;
    const qrCode = await QRCode.toDataURL(qrData);

    // Send email with QR code
    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Your RSVP Ticket",
      html: `<p>Thank you for RSVP'ing!</p>
             <p>Your QR Ticket is below:</p>
             <img src="${qrCode}" alt="QR Code" />`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email.");
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
