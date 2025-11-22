import DeliveryOrder from "../models/DeliveryOrder.js";
import Product from "../models/Products.js";
import Inventory from "../models/Inventory.js";
import Movement from "../models/Movements.js";
import Warehouse from "../models/Warehouse.js";
import mongoose from "mongoose";

// Create a new delivery order (Draft)
export const createDeliveryOrder = async (req, res) => {
    try {
        const { customer, warehouse, items, date, reference } = req.body;

        const deliveryOrder = new DeliveryOrder({
            customer,
            warehouse,
            items,
            date: date || Date.now(),
            reference,
            status: "Draft",
        });

        const savedOrder = await deliveryOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all delivery orders
export const getDeliveryOrders = async (req, res) => {
    try {
        const orders = await DeliveryOrder.find()
            .populate("warehouse")
            .populate("items.product")
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single delivery order
export const getDeliveryOrderById = async (req, res) => {
    try {
        const order = await DeliveryOrder.findById(req.params.id)
            .populate("warehouse")
            .populate("items.product");
        if (!order) {
            return res.status(404).json({ message: "Delivery Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update status (Pick, Pack)
export const updateDeliveryOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ["Draft", "Picked", "Packed", "Cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status update via this endpoint" });
        }

        const order = await DeliveryOrder.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: "Delivery Order not found" });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Validate Delivery Order (Decrease Stock)
export const validateDeliveryOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id } = req.params;
        const order = await DeliveryOrder.findById(id).session(session);

        if (!order) {
            throw new Error("Delivery Order not found");
        }

        if (order.status === "Validated") {
            throw new Error("Delivery Order is already validated");
        }

        // Check and Update stock for each item
        for (const item of order.items) {
            // Check global product stock (optional, depending on logic, but good to check)
            const product = await Product.findById(item.product).session(session);
            if (!product) throw new Error(`Product ${item.product} not found`);

            if (product.stock < item.quantity) {
                throw new Error(`Insufficient global stock for product ${product.name}`);
            }

            // Check specific warehouse inventory
            const inventory = await Inventory.findOne({
                product: item.product,
                warehouse: order.warehouse,
            }).session(session);

            if (!inventory || inventory.quantity < item.quantity) {
                throw new Error(`Insufficient stock in warehouse for product ${product.name}`);
            }

            // Decrease Product total stock
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: -item.quantity } },
                { session }
            );

            // Decrease Inventory record
            inventory.quantity -= item.quantity;
            await inventory.save({ session });

            // Update Warehouse products array
            const warehouseDoc = await Warehouse.findById(order.warehouse).session(session);
            if (warehouseDoc) {
                const productIndex = warehouseDoc.products.findIndex(
                    (p) => p.product.toString() === item.product.toString()
                );

                if (productIndex > -1) {
                    warehouseDoc.products[productIndex].quantity -= item.quantity;
                    if (warehouseDoc.products[productIndex].quantity < 0) {
                        warehouseDoc.products[productIndex].quantity = 0;
                    }
                }
                await warehouseDoc.save({ session });
            }

            // Create Movement Record
            await Movement.create(
                [
                    {
                        type: "Outgoing",
                        product: item.product,
                        fromWarehouse: order.warehouse,
                        toWarehouse: null, // Customer
                        quantity: item.quantity,
                        initiatedBy: req.user ? req.user._id : null,
                        status: "completed",
                        reference: `DO-${order._id}`
                    },
                ],
                { session }
            );
        }

        order.status = "Validated";
        await order.save({ session });

        await session.commitTransaction();
        res.status(200).json({ message: "Delivery Order validated and stock updated", order });
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
    }
};
