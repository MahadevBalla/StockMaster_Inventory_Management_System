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
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 0 }
        }
    ],
    quantity: {
        type: Number,
        default: 0
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

// Pre-save hook to calculate total quantity
WarehouseSchema.pre('save', function (next) {
    if (this.products && this.products.length > 0) {
        this.quantity = this.products.reduce((total, item) => total + item.quantity, 0);
    } else {
        this.quantity = 0;
    }
    this.currentOccupancy = this.quantity;
    next();
});

const Warehouse = mongoose.models.Warehouse || mongoose.model('Warehouse', WarehouseSchema);
export default Warehouse;