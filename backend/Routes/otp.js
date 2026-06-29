const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const OTP = require("../Model/OTP");

// Route to send OTP
router.post("/send", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Delete any existing OTP for this email
    await OTP.deleteMany({ email });

    // Save new OTP
    const otpDoc = new OTP({ email, otp });
    await otpDoc.save();

    console.log(`[OTP Verification] Generated OTP for ${email}: ${otp}`);

    // Create transporter if config is present
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "InternArea -Language Switch Verification OTP",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h2 style="color: #2563eb; text-align: center;">InternArea Email Verification</h2>
            <p>Hello,</p>
            <p>You requested to change the website language. For security purposes, please verify your email using the following One-Time Password (OTP):</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e3a8a; background-color: #eff6ff; padding: 10px 20px; border-radius: 5px; border: 1px dashed #2563eb;">${otp}</span>
            </div>
            <p style="color: #ef4444; font-weight: bold;">Note: This OTP is valid for 5 minutes only.</p>
            <p>If you did not request this, please ignore this email.</p>
            <hr style="border: 0; border-top: 1px solid #e0e0e0;" />
            <p style="font-size: 12px; color: #6b7280; text-align: center;">InternArea - The Internshala Clone</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      return res.status(200).json({ success: true, message: "OTP sent successfully to email" });
    } else {
      console.log(`[OTP Verification] Nodemailer credentials not set. Logging OTP to console.`);
      return res.status(200).json({
        success: true,
        message: "OTP generated successfully (logged to server console for development)",
        otp: otp, // For frontend testing ease when SMTP is not configured
      });
    }
  } catch (error) {
    console.error("Error in sending OTP:", error);
    return res.status(500).json({ error: "Failed to send OTP. Please try again." });
  }
});

// Route to verify OTP
router.post("/verify", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  try {
    const record = await OTP.findOne({ email, otp });
    if (!record) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Delete the OTP once verified
    await OTP.deleteOne({ _id: record._id });

    return res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Error in verifying OTP:", error);
    return res.status(500).json({ error: "Failed to verify OTP" });
  }
});

module.exports = router;
