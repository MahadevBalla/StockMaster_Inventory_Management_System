import Product from "../models/Products.js";
import Inventory from "../models/Inventory.js";
import mongoose from "mongoose";
// import generate from "../utils/barcodeGenAPI.js";
// import { handleMovement } from '../utils/handleMovement.js';

// Get all products
export const getProducts = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const products = await Product.find({})
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Product.countDocuments();

    res.status(200).json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      warehouse,
      stock,
      category,
      description,
      unit,
      isPerishable,
      defaultExpiryDays,
      minStockLevel,
    } = req.body;

    // Check for existing product with same name
    const existingProduct = await Product.findOne({ name });

    if (existingProduct) {
      // Add provided stock or increment by 1 if no stock specified
      const increment = stock ? Number(stock) : 1;
      existingProduct.stock += increment;
      await existingProduct.save();
      return res.status(200).json(existingProduct);
    }

    // Create new product
    const product = new Product({
      name,
      warehouse,
      stock: stock ? Number(stock) : 0,
      category,
      description,
      unit: unit || "piece",
      isPerishable: isPerishable || false,
      defaultExpiryDays,
      minStockLevel,
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({
      message: "Product creation failed",
      error: error.message,
    });
  }
}; // Update product
export const updateProduct = async (req, res) => {
  try {
    console.log("req.params:", req.params);
    const { productName } = req.params;
    const updates = req.body;

    console.log("Raw productName:", productName);
    const decodedName = decodeURIComponent(productName.replace(/\+/g, " "));
    console.log("Decoded productName:", decodedName);

    // Find product using case-insensitive search
    const product = await Product.findOne({
      name: { $regex: new RegExp(`^${decodedName}$`, "i") },
    });

    if (!product) {
      console.log("No product found for:", decodedName);
      return res.status(404).json({ message: "Product not found" });
    }

    // Name uniqueness check
    if (updates.name && updates.name !== product.name) {
      const existingProduct = await Product.findOne({
        name: { $regex: new RegExp(`^${updates.name}$`, "i") },
      });

      if (existingProduct) {
        return res.status(409).json({
          message: "Product name already exists",
          solution: "Use a different product name or keep the original",
        });
      }
      product.name = updates.name;
    }
    // Modified stock handling
    const updatableFields = [
      "description",
      "category",
      "unit",
      "minStockLevel",
      "isPerishable",
      "defaultExpiryDays",
      "warehouse",
    ];

    // Handle stock increment separately
    if (updates.stock !== undefined) {
      product.stock += Number(updates.stock);
    }

    // Update other fields
    updatableFields.forEach((field) => {
      if (updates[field] !== undefined) {
        product[field] = updates[field];
      }
    });

    // Warehouse validation (unchanged)
    if (updates.warehouse) {
      const warehouseExists = await Warehouse.exists({
        _id: updates.warehouse,
      });
      if (!warehouseExists) {
        return res.status(400).json({
          message: "Invalid warehouse reference",
          solution: "Provide a valid warehouse ID",
        });
      }
    }

    await product.validate();
    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    // Error handling (unchanged)
  }
};
// Delete product
export const deleteProduct = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { productId, warehouseId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Log movement when deleting a product (for stock removal)
    const inventory = await Inventory.findOne({
      product: productId,
      warehouse: warehouseId,
    });
    if (inventory && inventory.quantity > 0) {
      await handleMovement({
        type: "adjustment", // You can also use 'sale' if you want to treat it as a sale
        product: productId,
        quantity: -inventory.quantity, // Remove all stock
        fromWarehouse: warehouseId,
        initiatedBy: req.user.id,
        session,
      });
    }

    // Delete the product
    await product.remove({ session });

    await session.commitTransaction();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

// Purchase product (as you already have)
export const purchaseProduct = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { productId, quantity, warehouseId } = req.body;

    const inventory = await Inventory.findOne({
      product: productId,
      warehouse: warehouseId,
    });
    if (!inventory || inventory.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    await handleMovement({
      type: "sale",
      product: productId,
      quantity,
      fromWarehouse: warehouseId,
      initiatedBy: req.user.id,
      session,
    });

    await session.commitTransaction();
    res.status(200).json({ message: "Product purchased successfully" });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};
