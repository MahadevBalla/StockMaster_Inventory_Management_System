import express from "express";
import {
  createMovement,
  getAllMovements,
  getMovementById,
  updateMovement,
  deleteMovement,
  exportMovementsCSV
} from "../controllers/movements.controller.js";

const router = express.Router();

//export as csv
router.get("/export", exportMovementsCSV); 

// Create a new movement
router.post("/", createMovement);

// Get all movements
router.get("/", getAllMovements);

// Get a specific movement by ID
router.get("/:id", getMovementById);


// Update a movement
router.patch("/:id", updateMovement);

// Delete a movement
router.delete("/:id", deleteMovement);

export default router;
