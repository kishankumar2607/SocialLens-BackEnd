const User = require("../../models/userModel/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secretKey = process.env.SECRET_KEY;
const sendResetPasswordEmail = require("../../helper/emailService");

//Get signin token code
const signToken = (userId) =>
  jwt.sign({ id: userId }, secretKey, { expiresIn: "7d" });

//Registration code
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const user = await User.create({ name, email, password });

    const token = signToken(user._id);
    res.status(201).json({
      message: "Registration successful!",
      // token,
      // user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

//Login code
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

//Forgot password and send OTP code
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordCode = resetCode;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    await sendResetPasswordEmail(email, resetCode);

    res.status(200).json({
      message: "OTP sent to your email.",
      // resetCode,
    });
  } catch (err) {
    next(err);
  }
};

//Verify OTP code
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required" });
    }

    const user = await User.findOne({ email }).select(
      "+resetPasswordCode +resetPasswordExpires"
    );
    if (
      !user ||
      user.resetPasswordCode !== code ||
      user.resetPasswordExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    res.status(200).json({ message: "Code verified successfully" });
  } catch (err) {
    next(err);
  }
};

//Reset password code
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword, resetCode } = req.body;
    if (!email || !newPassword || !resetCode) {
      return res
        .status(400)
        .json({ message: "Email, new password, and reset code are required." });
    }

    const user = await User.findOne({ email }).select(
      "+password +resetPasswordCode +resetPasswordExpires"
    );
    if (
      !user ||
      user.resetPasswordCode !== resetCode ||
      user.resetPasswordExpires < Date.now()
    ) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset request" });
    }

    user.password = newPassword;

    // Now clear the OTP + expiry
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res
      .status(200)
      .json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
};

//Delete account code
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userId);
    return res
      .status(200)
      .json({ message: "Account has been deleted successfully." });
  } catch (error) {
    console.error("Delete Account Error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later" });
  }
};
