import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema(
  {
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    stock: { type: Number, default: 0 },
    name: { type: String, required: true },
    description: String,
    category: { type: String },
    unit: { type: String, enum: ["piece", "box"], default: "piece" },
    minStockLevel: Number,
    isPerishable: Boolean,
    defaultExpiryDays: Number,
  },
  { timestamps: true }
);

// Explicitly define indexes
ProductSchema.index({ name: 1 }, { unique: true }); // If you want unique product names
// ProductSchema.index({ category: 1 }); // Already had this via schema option

const Product = mongoose.model("Product", ProductSchema);
export default Product;
