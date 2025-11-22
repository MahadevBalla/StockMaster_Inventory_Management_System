// middlewares/validateProduct.js
export const validateProduct = (req, res, next) => {
  const { sku, name, minStockLevel } = req.body;

  // Required fields validation
  // if (!sku) return res.status(400).json({ message: 'SKU is required' });
  if (!name) return res.status(400).json({ message: "Name is required" });

  // Data type validation
  if (minStockLevel && typeof minStockLevel !== "number") {
    return res.status(400).json({ message: "minStockLevel must be a number" });
  }

  // Enum validation for unit
  const validUnits = ["piece", "kg", "liter", "box"];
  if (req.body.unit && !validUnits.includes(req.body.unit)) {
    return res.status(400).json({
      message: `Unit must be one of: ${validUnits.join(", ")}`,
    });
  }

  next(); // Validation passed
};
