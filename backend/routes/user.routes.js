import { Router } from "express";
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

export default router;
