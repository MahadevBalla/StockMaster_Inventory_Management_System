import mongoose from "mongoose";

const ReceiptSchema = new mongoose.Schema(
    {
        supplier: { type: String, required: true }, // Can be a reference to a Supplier model if created later
        warehouse: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Warehouse",
            required: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: { type: Number, required: true },
                unitPrice: { type: Number },
            },
        ],
        status: {
            type: String,
            enum: ["Draft", "Validated", "Cancelled"],
            default: "Draft",
        },
        date: { type: Date, default: Date.now },
        reference: { type: String }, // Optional external reference number
    },
    { timestamps: true }
);

const Receipt = mongoose.model("Receipt", ReceiptSchema);
export default Receipt;
