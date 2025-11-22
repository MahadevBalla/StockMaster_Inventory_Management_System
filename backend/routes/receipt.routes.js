import express from "express";
import {
    createReceipt,
    getReceipts,
    getReceiptById,
    validateReceipt,
} from "../controllers/receipt.controller.js";


const router = express.Router();

router.post("/", createReceipt);
router.get("/", getReceipts);
router.get("/:id", getReceiptById);
router.post("/:id/validate", validateReceipt);

export default router;
