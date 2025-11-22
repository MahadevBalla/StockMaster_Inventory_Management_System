import mongoose from "mongoose";
const WarehouseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: {
        address: String,
        city: String,
        // state: String,
        // country: String,
        postalCode: String,
        // coordinates: { type: [Number], index: '2dsphere' }
    },
    quantity:{
        type:Number,
        default:0
    },
    capacity: Number,
    currentOccupancy: Number,
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // isActive: { type: Boolean, default: true },
    // contact: {
    //     phone: String,
    //     email: String
    // }

}, { timestamps: true });
const Warehouse = mongoose.models.Warehouse || mongoose.model('Warehouse', WarehouseSchema);
export default Warehouse