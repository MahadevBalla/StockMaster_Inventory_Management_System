// 📦 Imports
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// ⏳ Optional: fallback values if .env is not loaded
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "1h";
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "7d";

// 🧩 Schema Definition

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "manager", "staff"],
      required: true,
    },
    warehouses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Warehouse",
        required: function () {
          return this.role !== "admin";
        },
      },
    ],
    lastLogin: Date,
    isActive: { type: Boolean, default: true },
    refreshTokens: [String],

    // OTP fields
    otpCode: String,
    otpExpiry: Date,
    isOtpVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);
// auto adds createdAt and updatedAt

// 🔐 Hash password before save if it's modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next(); // only hash if changed
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10); // salt rounds = 10
  next();
});

// 🔑 Custom method to verify password at login
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.passwordHash); // returns true/false
};

// 🔐 Custom method to generate access token (short-lived)
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

// 🔁 Custom method to generate refresh token (long-lived)
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

// ✅ Export the User model
export const User = mongoose.model("User", userSchema);
