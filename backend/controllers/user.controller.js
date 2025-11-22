import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  // Validation
  if (!username || !email || !password || !role) {
    return res
      .status(400)
      .json({ message: "Required fields: username, email, password, role" });
  }

  // if (role !== "admin" && !assignedWarehouse) {
  //   return res.status(400).json({
  //     message: "Warehouse assignment is required for non-admin roles",
  //   });
  // }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res
      .status(409)
      .json({ message: "Email or username already exists" });
  }

  const newUser = new User({
    username,
    email,
    passwordHash: password, // Will be hashed by pre-save hook
    role,
    // assignedWarehouse: role === "admin" ? undefined : assignedWarehouse,
  });

  await newUser.save();

  // Generate tokens
  const accessToken = newUser.generateAccessToken();
  const refreshToken = newUser.generateRefreshToken();

  newUser.refreshTokens.push(refreshToken);
  await newUser.save();

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      // assignedWarehouse: newUser.assignedWarehouse,
    },
    tokens: { accessToken, refreshToken },
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  console.log("Login attempt with:", req.body);
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await user.isPasswordCorrect(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate new tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Update user
  user.refreshTokens.push(refreshToken);
  user.lastLogin = new Date();
  await user.save();

  res.status(200).json({
    message: "Login successful",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      // assignedWarehouse: user.assignedWarehouse,
    },
    tokens: { accessToken, refreshToken },
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-passwordHash -refreshTokens"); // Hide sensitive data
  res.status(200).json({
    message: "All users fetched successfully",
    users,
  });
});
