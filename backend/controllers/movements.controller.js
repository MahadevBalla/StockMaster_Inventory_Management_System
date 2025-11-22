import Movement from "../models/Movements.js";
import Inventory from "../models/Inventory.js";
import mongoose from "mongoose";
import { Parser } from "json2csv";

// 📦 Create a new movement
export const createMovement = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      type,
      product,
      fromWarehouse,
      toWarehouse,
      fromLocation,
      toLocation,
      quantity,
      initiatedBy,
      status,
    } = req.body;

    if (!type || !product || !quantity || !initiatedBy) {
      throw new Error("Missing required fields");
    }

    // 1. Handle Stock Updates based on Type
    if (type === "Transfer") {
      if (!fromWarehouse || !toWarehouse) {
        throw new Error("Transfer requires both source and destination warehouses");
      }

      // Decrement from Source
      let sourceInventory;

      if (fromLocation) {
        // If location is specified, find inventory at that specific location
        sourceInventory = await Inventory.findOne({
          product,
          warehouse: fromWarehouse,
          locationInWarehouse: fromLocation
        }).session(session);
      } else {
        // If no location specified, find ANY inventory of this product in the warehouse
        sourceInventory = await Inventory.findOne({
          product,
          warehouse: fromWarehouse,
          quantity: { $gte: quantity } // Must have enough stock
        }).session(session);
      }

      if (!sourceInventory || sourceInventory.quantity < quantity) {
        throw new Error(`Insufficient stock at source ${fromLocation ? `(${fromLocation})` : 'warehouse'}`);
      }

      sourceInventory.quantity -= quantity;
      await sourceInventory.save({ session });

      // Increment at Destination
      const destInventory = await Inventory.findOne({
        product,
        warehouse: toWarehouse,
        locationInWarehouse: toLocation || "General"
      }).session(session);

      if (destInventory) {
        destInventory.quantity += Number(quantity);
        await destInventory.save({ session });
      } else {
        await Inventory.create([{
          product,
          warehouse: toWarehouse,
          locationInWarehouse: toLocation || "General",
          quantity: quantity,
          value: sourceInventory.value // Carry over value
        }], { session });
      }
    }

    // Handle Incoming (Receive from vendor)
    if (type === "Incoming") {
      if (!toWarehouse) {
        throw new Error("Incoming requires destination warehouse");
      }

      const destInventory = await Inventory.findOne({
        product,
        warehouse: toWarehouse,
        locationInWarehouse: toLocation || "General"
      }).session(session);

      if (destInventory) {
        destInventory.quantity += Number(quantity);
        await destInventory.save({ session });
      } else {
        await Inventory.create([{
          product,
          warehouse: toWarehouse,
          locationInWarehouse: toLocation || "General",
          quantity: quantity,
          value: { costPrice: 0, retailPrice: 0, currency: "INR" } // Default value
        }], { session });
      }
    }

    // Handle Outgoing (Deliver to customer)
    if (type === "Outgoing") {
      if (!fromWarehouse) {
        throw new Error("Outgoing requires source warehouse");
      }

      let sourceInventory;

      if (fromLocation) {
        sourceInventory = await Inventory.findOne({
          product,
          warehouse: fromWarehouse,
          locationInWarehouse: fromLocation
        }).session(session);
      } else {
        sourceInventory = await Inventory.findOne({
          product,
          warehouse: fromWarehouse,
          quantity: { $gte: quantity }
        }).session(session);
      }

      if (!sourceInventory || sourceInventory.quantity < quantity) {
        throw new Error(`Insufficient stock for outgoing delivery`);
      }

      sourceInventory.quantity -= quantity;
      await sourceInventory.save({ session });
    }

    // Handle Adjustment (damaged, lost, found items)
    if (type === "Adjustment") {
      if (!fromWarehouse) {
        throw new Error("Adjustment requires warehouse");
      }

      let inventory;

      if (fromLocation) {
        inventory = await Inventory.findOne({
          product,
          warehouse: fromWarehouse,
          locationInWarehouse: fromLocation
        }).session(session);
      } else {
        inventory = await Inventory.findOne({
          product,
          warehouse: fromWarehouse
        }).session(session);
      }

      if (!inventory) {
        throw new Error(`Product not found in warehouse`);
      }

      // Quantity can be positive (found items) or negative (damaged/lost)
      inventory.quantity += Number(quantity);

      if (inventory.quantity < 0) {
        throw new Error(`Adjustment would result in negative stock`);
      }

      await inventory.save({ session });
    }

    // 2. Create Movement Record
    const newMovement = await Movement.create([{
      type,
      product,
      fromWarehouse,
      toWarehouse,
      fromLocation,
      toLocation,
      quantity,
      initiatedBy,
      status: status || "completed",
    }], { session });

    await session.commitTransaction();
    res.status(201).json(newMovement[0]);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

// 🔍 Get all movements with optional filters
export const getAllMovements = async (req, res) => {
  try {
    const filters = {};

    if (req.query.product) filters.product = req.query.product;
    if (req.query.type) filters.type = req.query.type;
    if (req.query.status) filters.status = req.query.status;

    const movements = await Movement.find(filters)
      .populate("product fromWarehouse toWarehouse initiatedBy")
      .sort({ createdAt: -1 });

    res.status(200).json(movements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Get a specific movement by ID
export const getMovementById = async (req, res) => {
  try {
    const movement = await Movement.findById(req.params.id).populate(
      "product fromWarehouse toWarehouse initiatedBy"
    );

    if (!movement) {
      return res.status(404).json({ message: "Movement not found" });
    }

    res.status(200).json(movement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update movement details (status, etc.)
export const updateMovement = async (req, res) => {
  try {
    const updatedMovement = await Movement.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate("product fromWarehouse toWarehouse initiatedBy");

    if (!updatedMovement) {
      return res.status(404).json({ message: "Movement not found" });
    }

    res.status(200).json(updatedMovement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ Delete a movement
export const deleteMovement = async (req, res) => {
  try {
    const deletedMovement = await Movement.findByIdAndDelete(req.params.id);
    if (!deletedMovement) {
      return res.status(404).json({ message: "Movement not found" });
    }

    res.status(200).json({ message: "Movement deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//export as csv
export const exportMovementsCSV = async (req, res) => {
  try {
    const movements = await Movement.find()
      .populate("product", "name")
      .populate("fromWarehouse", "name")
      .populate("toWarehouse", "name")
      .populate("initiatedBy", "username email")
      .lean(); // return plain objects

    const formatted = movements.map((m) => ({
      Type: m.type,
      Product: m.product?.name || "",
      From: m.fromWarehouse?.name || "",
      To: m.toWarehouse?.name || "",
      Quantity: m.quantity,
      InitiatedBy: m.initiatedBy?.username || "",
      Status: m.status,
      CreatedAt: m.createdAt,
    }));

    const fields = [
      "Type",
      "Product",
      "From",
      "To",
      "Quantity",
      "InitiatedBy",
      "Status",
      "CreatedAt",
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(formatted);

    res.header("Content-Type", "text/csv");
    res.attachment("movements.csv");
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to export CSV" });
  }
};
