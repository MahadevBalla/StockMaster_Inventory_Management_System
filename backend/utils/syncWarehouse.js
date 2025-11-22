// Helper function to sync warehouse products array from inventory
// Call this after movements to ensure warehouse data is up-to-date

import Warehouse from '../models/Warehouse.js';
import Inventory from '../models/Inventory.js';

export const syncWarehouseFromInventory = async (warehouseId) => {
    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) return;

    // Get all inventory for this warehouse
    const inventories = await Inventory.find({ warehouse: warehouseId });

    // Group by product and sum quantities
    const productMap = new Map();
    inventories.forEach(inv => {
        const prodId = inv.product.toString();
        productMap.set(prodId, (productMap.get(prodId) || 0) + inv.quantity);
    });

    // Rebuild products array
    warehouse.products = Array.from(productMap.entries()).map(([productId, qty]) => ({
        product: productId,
        quantity: qty
    }));

    await warehouse.save();
    return warehouse;
};

export const syncAllWarehouses = async () => {
    const warehouses = await Warehouse.find({});
    for (const warehouse of warehouses) {
        await syncWarehouseFromInventory(warehouse._id);
    }
};
