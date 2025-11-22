import mongoose from "mongoose";
import dotenv from "dotenv";
import Warehouse from "./models/Warehouse.js";
import { DB_NAME } from "./constants.js";

dotenv.config();

const verifyData = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log("Connected to MongoDB");

        const warehouses = await Warehouse.find({});
        console.log("Warehouses Verification:");
        warehouses.forEach(w => {
            console.log(`- ${w.name}: Capacity=${w.capacity}, Quantity=${w.quantity}, CurrentOccupancy=${w.currentOccupancy}`);
        });

        mongoose.disconnect();
    } catch (error) {
        console.error("Error verifying data:", error);
    }
};

verifyData();
