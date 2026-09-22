import bcrypt from "bcryptjs";
import User from "../schemas/user.schema.js";
import dotenv from "dotenv";
dotenv.config();
import { createTransporter } from "../utils/emailService.js";


// super admin Register
const transporter = createTransporter();

async function registerUser(userData) {
  try {
    const { firstName, lastName, email, password } = userData;

    if (!firstName || !lastName || !email || !password ) {
      return {
        status: 400,
        message: "Please provide valid name, email, password and user type",
      };
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser) {
        return {
          status: 409,
          message:
            "Email already exists. Please use a different email or log in.",
        };
      } else {
        const otp = generateOTP();
        const hashedPassword = await bcrypt.hash(password, 2);

        await User.findOneAndUpdate(
          { email },
          { otp, password: hashedPassword },
          { new: true }
        );

        await sendVerificationEmail(email, otp);

        return {
          status: 403,
          message:
            "Email verification required. OTP sent to email for verification.",
        };
      }
    }

    const otp = generateOTP();
    const hashedPassword = await bcrypt.hash(password, 2);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      otp,
    });

    await newUser.save();

    await sendVerificationEmail(email, otp);

    return {
      status: 201,
      message:
        "User registered successfully. OTP sent to email for verification.",
    };
  } catch (err) {
    console.error(err);
    return {
      status: 500,
      message: "Internal Server Error",
      error: err.message,
    };
  }
}

async function sendVerificationEmail(email, otp) {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}. Please use this code to verify your account.`,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error(err);
    throw new Error("Error sending verification email");
  }
}

async function verifyOTP(email, otp) {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return { status: 404, message: "User not found" };
    }

    if (user.isVerified) {
      return { status: 409, message: "Email already verified" };
    }

    if (user.otp !== otp) {
      return { status: 401, message: "Invalid OTP" };
    }

    await User.findOneAndUpdate(
      { email },
      { isVerified: true, $unset: { otp: "" } }
    );

    return { status: 200, message: "Email verified successfully" };
  } catch (err) {
    console.error(err);
    return { status: 500, message: "An error occurred while verifying OTP" };
  }
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function requestPasswordReset(email) {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return { status: 404, message: "User not found" };
    }

    const otp = generateOTP();
    const otpExpiration = new Date(Date.now() + 600000); // OTP valid for 10 minutes

    await User.findOneAndUpdate(
      { email },
      { otp, otpExpiration }
    );

    await sendPasswordResetOTP(email, otp);

    return {
      status: 200,
      message: "Password reset OTP sent. Check your email for instructions.",
    };
  } catch (err) {
    console.error(err);
    return {
      status: 500,
      message: "Internal Server Error",
      error: err.message,
    };
  }
}

async function sendPasswordResetOTP(email, otp) {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset OTP",
      text: `Password reset OTP: ${otp}.  Use this code within 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error(err);
    throw new Error("Error sending password reset OTP email");
  }
}

async function resetPassword(email, otp, newPassword) {
  try {
    const user = await User.findOne({ email, otp });

    if (!user || user.otpExpiration < new Date()) {
      return { status: 404, message: "Invalid or expired OTP" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 2);

    await User.findOneAndUpdate(
      { email },
      { password: hashedPassword, otp: null, otpExpiration: null }
    );

    return { status: 200, message: "Password reset successfully" };
  } catch (err) {
    console.error(err);
    return {
      status: 500,
      message: "Internal Server Error",
      error: err.message,
    };
  }
}



export default { registerUser, verifyOTP,requestPasswordReset,resetPassword };
