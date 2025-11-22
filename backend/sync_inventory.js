import mongoose from 'mongoose';
import Product from './models/Products.js';
import Inventory from './models/Inventory.js';
import dotenv from 'dotenv';

dotenv.config();

const syncInventory = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const products = await Product.find({});

        for (const product of products) {
            console.log(`\nProcessing: ${product.name}`);
            console.log(`Product stock: ${product.stock}`);

            // Find ALL inventory for this product in this warehouse
            const inventories = await Inventory.find({
                product: product._id,
                warehouse: product.warehouse
            });

            if (inventories.length > 0) {
                console.log(`Found ${inventories.length} inventory location(s)`);

                // Update the first one
                const mainInventory = inventories[0];
                console.log(`Current inventory at ${mainInventory.locationInWarehouse}: ${mainInventory.quantity}`);
                mainInventory.quantity = product.stock;
                await mainInventory.save();
                console.log(`Updated inventory to: ${product.stock}`);

                // Delete other locations (consolidate)
                if (inventories.length > 1) {
                    for (let i = 1; i < inventories.length; i++) {
                        await Inventory.deleteOne({ _id: inventories[i]._id });
                        console.log(`Removed duplicate at ${inventories[i].locationInWarehouse}`);
                    }
                }
            } else {
                console.log('No inventory found, creating new...');
                await Inventory.create({
                    product: product._id,
                    warehouse: product.warehouse,
                    locationInWarehouse: "General",
                    quantity: product.stock,
                    value: { costPrice: 0, retailPrice: 0, currency: "INR" }
                });
                console.log(`Created inventory with quantity: ${product.stock}`);
            }
        }

        console.log('\n✅ Sync completed!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

syncInventory();
