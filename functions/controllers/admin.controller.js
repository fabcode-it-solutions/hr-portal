import express from "express";
import Admin from "../services/admin.service.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const router = express.Router();

router.post("/super-admin", async (req, res) => {
  try {
    const data = await Admin.registerUser(req.body);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json("Error: ", err);
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const verifiedOtp = await Admin.verifyOTP(email, otp);
    res.status(200).send(verifiedOtp);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error occurred while verifying OTP" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const resetRequest = await Admin.requestPasswordReset(email);
    res.status(resetRequest.status).json(resetRequest);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while initiating password reset" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const passwordReset = await Admin.resetPassword(email, otp, newPassword);
    res.status(passwordReset.status).json(passwordReset);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while resetting password" });
  }
});

export default router;
