import Receipt from "../models/Receipt.js";
import Product from "../models/Products.js";
import Inventory from "../models/Inventory.js";
import Movement from "../models/Movements.js";
import mongoose from "mongoose";

// Create a new receipt (Draft)
export const createReceipt = async (req, res) => {
    try {
        const { supplier, warehouse, items, date, reference } = req.body;

        const receipt = new Receipt({
            supplier,
            warehouse,
            items,
            date: date || Date.now(),
            reference,
            status: "Draft",
        });

        const savedReceipt = await receipt.save();
        res.status(201).json(savedReceipt);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all receipts
export const getReceipts = async (req, res) => {
    try {
        const receipts = await Receipt.find()
            .populate("warehouse")
            .populate("items.product")
            .sort({ createdAt: -1 });
        res.status(200).json(receipts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single receipt
export const getReceiptById = async (req, res) => {
    try {
        const receipt = await Receipt.findById(req.params.id)
            .populate("warehouse")
            .populate("items.product");
        if (!receipt) {
            return res.status(404).json({ message: "Receipt not found" });
        }
        res.status(200).json(receipt);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Validate Receipt (Increase Stock)
export const validateReceipt = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id } = req.params;
        const receipt = await Receipt.findById(id).session(session);

        if (!receipt) {
            throw new Error("Receipt not found");
        }

        if (receipt.status === "Validated") {
            throw new Error("Receipt is already validated");
        }

        // Update stock for each item
        for (const item of receipt.items) {
            // Update Product total stock
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: item.quantity } },
                { session }
            );

            // Update or Create Inventory record for specific warehouse
            let inventory = await Inventory.findOne({
                product: item.product,
                warehouse: receipt.warehouse,
            }).session(session);

            if (inventory) {
                inventory.quantity += item.quantity;
                await inventory.save({ session });
            } else {
                await Inventory.create(
                    [
                        {
                            product: item.product,
                            warehouse: receipt.warehouse,
                            quantity: item.quantity,
                            location: "Receiving Area", // Default location
                        },
                    ],
                    { session }
                );
            }

            // Create Movement Record
            await Movement.create(
                [
                    {
                        type: "Incoming",
                        product: item.product,
                        fromWarehouse: null, // External supplier
                        toWarehouse: receipt.warehouse,
                        quantity: item.quantity,
                        initiatedBy: req.user ? req.user._id : null, // Assuming auth middleware adds user
                        status: "completed",
                    },
                ],
                { session }
            );
        }

        receipt.status = "Validated";
        await receipt.save({ session });

        await session.commitTransaction();
        res.status(200).json({ message: "Receipt validated and stock updated", receipt });
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
    }
};
