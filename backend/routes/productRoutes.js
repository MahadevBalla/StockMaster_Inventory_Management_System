// routes/productRoutes.js
import express from "express";
import {
  getProducts,
  createProduct,
  purchaseProduct,
  updateProduct,
} from "../controllers/productController.js";
import { validateProduct } from "../middlewares/validateProduct.js";

const router = express.Router();

// GET /api/v1/products - Get all products
router.get("/", getProducts);

// POST /api/products - Create new product
router.post("/", validateProduct, createProduct);

// DELETE route for purchases
router.post("/purchase", purchaseProduct);

// DELETE route for products
router.post("/delete/:productName", purchaseProduct);

//Update a product
router.patch("/update/:productName", updateProduct);
export default router;
