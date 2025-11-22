import express from "express";
import {
    createDeliveryOrder,
    getDeliveryOrders,
    getDeliveryOrderById,
    updateDeliveryOrderStatus,
    validateDeliveryOrder,
} from "../controllers/deliveryOrder.controller.js";

const router = express.Router();

router.post("/", createDeliveryOrder);
router.get("/", getDeliveryOrders);
router.get("/:id", getDeliveryOrderById);
router.put("/:id/status", updateDeliveryOrderStatus);
router.post("/:id/validate", validateDeliveryOrder);

export default router;
