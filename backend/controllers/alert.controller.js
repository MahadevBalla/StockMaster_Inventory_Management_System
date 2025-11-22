import Alerts from "../models/Alerts.js";
import Product from "../models/Products.js";
import Inventory from "../models/Inventory.js";
import Movement from "../models/Movements.js";
import Warehouse from "../models/Warehouse.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import mongoose from "mongoose";

// 🔁 1. Check and trigger various alerts
export const checkAlerts = asyncHandler(async (req, res) => {
  const newAlerts = [];

  const products = await Product.find().populate("warehouse");
  const inventories = await Inventory.find();
  const warehouses = await Warehouse.find();
  const now = new Date();

  // 🧮 LOW STOCK / OUT OF STOCK ALERTS
  for (const product of products) {
    const inventory = inventories.find(inv =>
      inv.product?.toString() === product._id.toString() &&
      inv.warehouse?.toString() === product.warehouse._id.toString()
    );

    if (!inventory) continue;

    if (product.minStockLevel !== undefined && inventory.quantity < product.minStockLevel) {
      const exists = await Alerts.findOne({
        type: "low-stock",
        product: product._id,
        status: { $in: ["active", "acknowledged"] }
      });
      if (!exists) {
        const alert = await Alerts.create({
          type: "low-stock",
          product: product._id,
          warehouse: product.warehouse._id,
          threshold: product.minStockLevel,
          currentValue: inventory.quantity,
          notes: "Stock below minimum threshold"
        });
        newAlerts.push(alert);
      }
    }

    if (inventory.quantity === 0) {
      const exists = await Alerts.findOne({
        type: "discrepancy",
        product: product._id,
        status: { $in: ["active", "acknowledged"] }
      });
      if (!exists) {
        const alert = await Alerts.create({
          type: "discrepancy",
          product: product._id,
          warehouse: product.warehouse._id,
          currentValue: 0,
          notes: "Product is completely out of stock"
        });
        newAlerts.push(alert);
      }
    }
  }

  // 🕒 EXPIRY ALERTS
  for (const inv of inventories) {
    if (!inv.batchInfo?.expiryDate) continue;

    const expiryDate = new Date(inv.batchInfo.expiryDate);
    const daysUntilExpiry = (expiryDate - now) / (1000 * 60 * 60 * 24);

    if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
      const exists = await Alerts.findOne({
        type: "expiry",
        status: { $in: ["active", "acknowledged"] },
        product: inv.product
      });

      if (!exists) {
        const alert = await Alerts.create({
          type: "expiry",
          product: inv.product,
          warehouse: inv.warehouse,
          currentValue: inv.quantity,
          notes: `Product will expire in ${Math.round(daysUntilExpiry)} days`
        });
        newAlerts.push(alert);
      }
    }

    if (expiryDate < now) {
      const exists = await Alerts.findOne({
        type: "expiry",
        status: { $in: ["active", "acknowledged"] },
        product: inv.product
      });

      if (!exists) {
        const alert = await Alerts.create({
          type: "expiry",
          product: inv.product,
          warehouse: inv.warehouse,
          currentValue: inv.quantity,
          notes: "Product has already expired"
        });
        newAlerts.push(alert);
      }
    }
  }

  // 🧱 OVER-CAPACITY ALERTS
  for (const warehouse of warehouses) {
    if (
      warehouse.capacity &&
      warehouse.currentOccupancy &&
      warehouse.currentOccupancy > warehouse.capacity
    ) {
      const exists = await Alerts.findOne({
        type: "discrepancy",
        warehouse: warehouse._id,
        status: { $in: ["active", "acknowledged"] }
      });

      if (!exists) {
        const alert = await Alerts.create({
          type: "discrepancy",
          warehouse: warehouse._id,
          notes: `Warehouse over capacity (${warehouse.currentOccupancy}/${warehouse.capacity})`
        });
        newAlerts.push(alert);
      }
    }
  }

  res
    .status(200)
    .json(new ApiResponse(200, newAlerts, `${newAlerts.length} alerts generated`));
});


// ✅ 2. Get all alerts
export const getAllAlerts = asyncHandler(async (req, res) => {
  const alerts = await Alerts.find().populate("product warehouse");
  res.status(200).json(new ApiResponse(200, alerts, "All alerts fetched"));
});


// ✅ 3. Acknowledge an alert
export const acknowledgeAlert = asyncHandler(async (req, res) => {
  const alert = await Alerts.findById(req.params.id);
  if (!alert) {
    return res.status(404).json({ message: "Alert not found" });
  }
  alert.status = "acknowledged";
  await alert.save();
  res.status(200).json(new ApiResponse(200, alert, "Alert acknowledged"));
});


// ✅ 4. Resolve an alert
export const resolveAlert = asyncHandler(async (req, res) => {
  const alert = await Alerts.findById(req.params.id);
  if (!alert) {
    return res.status(404).json({ message: "Alert not found" });
  }
  alert.status = "resolved";
  await alert.save();
  res.status(200).json(new ApiResponse(200, alert, "Alert resolved"));
});


// ✅ 5. Create alert manually (optional)
export const createAlert = asyncHandler(async (req, res) => {
  const { type, product, warehouse, notes, threshold, currentValue } = req.body;

  const newAlert = await Alerts.create({
    type,
    product,
    warehouse,
    notes,
    threshold,
    currentValue
  });

  res.status(201).json(new ApiResponse(201, newAlert, "Alert created successfully"));
});
