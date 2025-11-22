import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { syncAllWarehouses } from './utils/syncWarehouse.js';

dotenv.config();

const sync = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        console.log('Syncing all warehouses from inventory data...');
        await syncAllWarehouses();

        console.log('✅ All warehouses synced successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

sync();
