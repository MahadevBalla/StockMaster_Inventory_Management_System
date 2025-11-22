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
    username: { type: String, required: true, unique: true }, // unique usernames
    email: { type: String, required: true, unique: true }, // unique emails
    passwordHash: { type: String, required: true }, // hashed password only
    role: {
      type: String,
      enum: ["admin", "manager", "staff"], // only these values allowed
      required: true,
    },
    warehouses: [
      {
        type: mongoose.Schema.Types.ObjectId, // reference to Warehouse model
        ref: "Warehouse",
        required: function () {
          return this.role !== "admin";
        }, // Admin doesn't need warehouse
      },
    ],
    lastLogin: Date, // for logging login history
    isActive: { type: Boolean, default: true }, // soft delete functionality
    refreshTokens: [String], // multiple valid refresh tokens
  },
  { timestamps: true }
); // auto adds createdAt and updatedAt

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
