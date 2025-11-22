import Inventory from "../models/Inventory.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Parser } from "json2csv";

// GET /api/v1/inventory/export
export const exportInventoryCSV = asyncHandler(async (req, res) => {
  const inventories = await Inventory.find().lean();

  if (!inventories || inventories.length === 0) {
    return res
      .status(404)
      .json({ message: "No inventory data found to export" });
  }

  try {
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(inventories);

    res.header("Content-Type", "text/csv");
    res.attachment("inventory_export.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: "CSV export failed", error: err.message });
  }
});

// Create Inventory
export const createInventory = asyncHandler(async (req, res) => {
  const inventory = new Inventory(req.body);
  await inventory.save();
  res.status(201).json({ message: "Inventory created", inventory });
});

// Get All Inventories
export const getAllInventories = asyncHandler(async (req, res) => {
  const inventories = await Inventory.find(); // optionally populate product & warehouse
  res.status(200).json({ message: "All inventories", inventories });
});

// Update Inventory
export const updateInventory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const inventory = await Inventory.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!inventory) {
    return res.status(404).json({ message: "Inventory not found" });
  }

  res.status(200).json({ message: "Inventory updated", inventory });
});

// Delete Inventory
export const deleteInventory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const inventory = await Inventory.findByIdAndDelete(id);

  if (!inventory) {
    return res.status(404).json({ message: "Inventory not found" });
  }

  res.status(200).json({ message: "Inventory deleted", inventory });
});

// Allocate Stock
export const allocateStock = asyncHandler(async (req, res) => {
  const { productId, warehouseId, quantity } = req.body;

  const inventory = await Inventory.allocateStock(
    productId,
    warehouseId,
    quantity
  );
  res.status(200).json({ message: "Stock allocated", inventory });
});

// Release Allocated Stock
export const releaseStock = asyncHandler(async (req, res) => {
  const { productId, warehouseId, quantity } = req.body;

  const inventory = await Inventory.releaseAllocatedStock(
    productId,
    warehouseId,
    quantity
  );
  res.status(200).json({ message: "Allocated stock released", inventory });
});

// Adjust Stock
export const adjustStock = asyncHandler(async (req, res) => {
  const { productId, warehouseId, quantity, reason } = req.body;

  const inventory = await Inventory.adjustStock(
    productId,
    warehouseId,
    quantity,
    reason
  );
  res.status(200).json({ message: "Stock adjusted", inventory });
});
