import mongoose from "mongoose";
const MovementSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Incoming", "Outgoing", "Transfer", "Adjustment"],
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    fromWarehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
    },
    toWarehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
    },
    fromLocation: String, // e.g., "Rack A", "Main Warehouse"
    toLocation: String,   // e.g., "Rack B", "Production Floor"
    quantity: { type: Number, required: true },
    // unitPrice: Number,
    // reference: String, // PO number, invoice number, etc.
    initiatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "completed",
    },
    // notes: String,
    // metadata: mongoose.Schema.Types.Mixed,
    // reversalOf: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Movement",
    // },
  },
  { timestamps: true }
);

// Indexes for reporting
MovementSchema.index({ product: 1, createdAt: 1 });
MovementSchema.index({ type: 1, createdAt: 1 });
MovementSchema.index({ initiatedBy: 1, createdAt: 1 });

const Movement = mongoose.model("Movement", MovementSchema);
export default Movement;
