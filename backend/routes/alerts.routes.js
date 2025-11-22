import express from "express";
import {
  getAllAlerts,
  acknowledgeAlert,
  resolveAlert,
  createAlert,
  checkAlerts
} from "../controllers/alert.controller.js";

const router = express.Router();

router.get("/", getAllAlerts);
router.post("/check", checkAlerts); // Scan and generate new alerts
router.patch("/:id/acknowledge", acknowledgeAlert);
router.patch("/:id/resolve", resolveAlert);
router.post("/", createAlert); // Optional: manual alert

export default router;
