import mongoose from 'mongoose';
const mongoose = require('mongoose');
const ReportSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: {
        type: String,
        enum: ['inventory-valuation', 'stock-movement', 'slow-moving', 'fast-moving', 'expiry', 'custom'],
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    filters: mongoose.Schema.Types.Mixed,
    data: mongoose.Schema.Types.Mixed, // Store report results for caching
    format: { type: String, enum: ['csv', 'pdf', 'json'], default: 'json' },
    lastGenerated: Date,
    isRecurring: Boolean,
    recurrence: String, // 'daily', 'weekly', 'monthly'
    nextRun: Date
}, { timestamps: true });
const Report = mongoose.model('Report', ReportSchema);
export default Report;