import mongoose from "mongoose";

const DeliveryOrderSchema = new mongoose.Schema(
  {
    customer: { type: String, required: true },
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
      },
    ],
    status: {
      type: String,
      enum: ["Draft", "Picked", "Packed", "Validated", "Cancelled"],
      default: "Draft",
    },
    date: { type: Date, default: Date.now },
    reference: { type: String },
  },
  { timestamps: true }
);

const DeliveryOrder = mongoose.model("DeliveryOrder", DeliveryOrderSchema);
export default DeliveryOrder;
