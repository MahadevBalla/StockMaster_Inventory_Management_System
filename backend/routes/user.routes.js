import { Router } from "express";
import { sendOtp, verifyOtp, resetPassword } from "../controllers/user.controller.js";
import {
  registerUser,
  loginUser,
  getAllUsers,
} from "../controllers/user.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getAllUsers));
router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser));
router.post("/send-otp", asyncHandler(sendOtp));
router.post("/verify-otp", asyncHandler(verifyOtp));
router.post("/reset-password", asyncHandler(resetPassword));
export default router;
