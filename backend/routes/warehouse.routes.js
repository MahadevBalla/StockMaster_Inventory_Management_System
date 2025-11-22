import express from "express";
import { addWarehouse, getAllWarehouses } from "../controllers/warehouse.controller.js";

const router = express.Router();

router.post("/", addWarehouse);     // Add new warehouse
router.get("/", getAllWarehouses);  // Get all warehouses

export default router;
