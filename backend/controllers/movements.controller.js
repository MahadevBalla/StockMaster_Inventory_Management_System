import Movement from "../models/Movements.js";
import Product from "../models/Products.js";
import Warehouse from "../models/Warehouse.js";
import mongoose from "mongoose";
import { Parser } from "json2csv";

// 📦 Create a new movement (Simplified - Product + Warehouse only)
export const createMovement = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      type,
      product,
      fromWarehouse,
      toWarehouse,
      quantity,
      initiatedBy,
      status,
    } = req.body;

    if (!type || !product || !quantity || !initiatedBy) {
      throw new Error("Missing required fields");
    }

    const productDoc = await Product.findById(product).session(session);
    if (!productDoc) {
      throw new Error("Product not found");
    }

    // 1. Handle Stock Updates based on Type
    if (type === "Transfer") {
      if (!fromWarehouse || !toWarehouse) {
        throw new Error("Transfer requires both source and destination warehouses");
      }

      // Get source warehouse
      const sourceWH = await Warehouse.findById(fromWarehouse).session(session);
      if (!sourceWH) {
        throw new Error("Source warehouse not found");
      }

      // Find product in source warehouse
      const sourceProductIndex = sourceWH.products.findIndex(
        p => p.product.toString() === product
      );

      if (sourceProductIndex === -1 || sourceWH.products[sourceProductIndex].quantity < quantity) {
        const available = sourceProductIndex >= 0 ? sourceWH.products[sourceProductIndex].quantity : 0;
        throw new Error(`Insufficient stock in source warehouse. Available: ${available}, Requested: ${quantity}`);
      }

      // Decrement from source
      sourceWH.products[sourceProductIndex].quantity -= quantity;
      if (sourceWH.products[sourceProductIndex].quantity === 0) {
        sourceWH.products.splice(sourceProductIndex, 1);
      }
      await sourceWH.save({ session });

      // Get destination warehouse
      const destWH = await Warehouse.findById(toWarehouse).session(session);
      if (!destWH) {
        throw new Error("Destination warehouse not found");
      }

      // Increment at destination
      const destProductIndex = destWH.products.findIndex(
        p => p.product.toString() === product
      );

      if (destProductIndex >= 0) {
        destWH.products[destProductIndex].quantity += quantity;
      } else {
        destWH.products.push({ product, quantity });
      }
      await destWH.save({ session });

      // Product.stock remains unchanged (just moved between warehouses)
    }

    // Handle Incoming (Receive from vendor)
    if (type === "Incoming") {
      if (!toWarehouse) {
        throw new Error("Incoming requires destination warehouse");
      }

      // Increment Product.stock
      productDoc.stock += quantity;
      await productDoc.save({ session });

      // Increment warehouse quantity
      const warehouse = await Warehouse.findById(toWarehouse).session(session);
      if (!warehouse) {
        throw new Error("Warehouse not found");
      }

      const productIndex = warehouse.products.findIndex(
        p => p.product.toString() === product
      );

      if (productIndex >= 0) {
        warehouse.products[productIndex].quantity += quantity;
      } else {
        warehouse.products.push({ product, quantity });
      }
      await warehouse.save({ session });
    }

    // Handle Outgoing (Deliver to customer)
    if (type === "Outgoing") {
      if (!fromWarehouse) {
        throw new Error("Outgoing requires source warehouse");
      }

      // Get warehouse
      const warehouse = await Warehouse.findById(fromWarehouse).session(session);
      if (!warehouse) {
        throw new Error("Warehouse not found");
      }

      // Find product in warehouse
      const productIndex = warehouse.products.findIndex(
        p => p.product.toString() === product
      );

      if (productIndex === -1 || warehouse.products[productIndex].quantity < quantity) {
        const available = productIndex >= 0 ? warehouse.products[productIndex].quantity : 0;
        throw new Error(`Insufficient stock in warehouse. Available: ${available}, Requested: ${quantity}`);
      }

      // Decrement warehouse quantity
      warehouse.products[productIndex].quantity -= quantity;
      if (warehouse.products[productIndex].quantity === 0) {
        warehouse.products.splice(productIndex, 1);
      }
      await warehouse.save({ session });

      // Decrement Product.stock
      productDoc.stock -= quantity;
      await productDoc.save({ session });
    }

    // Handle Adjustment (damaged, lost, found items)
    if (type === "Adjustment") {
      if (!fromWarehouse) {
        throw new Error("Adjustment requires warehouse");
      }

      // Get warehouse
      const warehouse = await Warehouse.findById(fromWarehouse).session(session);
      if (!warehouse) {
        throw new Error("Warehouse not found");
      }

      // Find product in warehouse
      const productIndex = warehouse.products.findIndex(
        p => p.product.toString() === product
      );

      if (productIndex === -1) {
        throw new Error("Product not found in warehouse");
      }

      // Update warehouse quantity (can be positive or negative)
      warehouse.products[productIndex].quantity += quantity;

      if (warehouse.products[productIndex].quantity < 0) {
        throw new Error("Adjustment would result in negative stock");
      }

      if (warehouse.products[productIndex].quantity === 0) {
        warehouse.products.splice(productIndex, 1);
      }
      await warehouse.save({ session });

      // Update Product.stock
      productDoc.stock += quantity;
      if (productDoc.stock < 0) {
        throw new Error("Adjustment would result in negative total stock");
      }
      await productDoc.save({ session });
    }

    // 2. Create Movement Record
    const newMovement = await Movement.create([{
      type,
      product,
      fromWarehouse,
      toWarehouse,
      quantity,
      initiatedBy,
      status: status || "completed"
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

// Export as CSV
export const exportMovementsCSV = async (req, res) => {
  try {
    const movements = await Movement.find()
      .populate("product", "name")
      .populate("fromWarehouse", "name")
      .populate("toWarehouse", "name")
      .populate("initiatedBy", "username email")
      .lean();

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
