import mongoose from "mongoose";
const AlertSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['low-stock', 'expiry', 'discrepancy'],
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse'
    },
    threshold: Number,
    currentValue: Number,
    // severity: { type: String, enum: ['low', 'medium', 'high'] },
    status: {
        type: String,
        enum: ['active', 'acknowledged', 'resolved'],
        default: 'active'
    },
    acknowledgedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    acknowledgedAt: Date,
    resolvedAt: Date,
    notes: String
}, { timestamps: true });
const Alerts = mongoose.model('Alerts', AlertSchema);
export default Alerts;