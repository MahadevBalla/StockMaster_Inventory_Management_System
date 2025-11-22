import Warehouse from "../models/Warehouse.js"; // Or wherever your schema file is
import ApiError from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";

// POST /api/warehouse - Add new warehouse
export const addWarehouse = asyncHandler(async (req, res) => {
    const { name, location, capacity, currentOccupancy, manager } = req.body;

    if (!name || !location) {
        throw new ApiError(400, "Name and location are required");
    }

    const newWarehouse = await Warehouse.create({
        name,
        location,
        capacity,
        currentOccupancy,
        manager
    });

    res.status(201).json(new ApiResponse(201, newWarehouse, "Warehouse created successfully"));
});

// GET /api/warehouse - Get all warehouses
export const getAllWarehouses = asyncHandler(async (req, res) => {
    const warehouses = await Warehouse.find().populate("manager", "name email role"); // adjust fields as needed
    res.status(200).json(new ApiResponse(200, warehouses, "Fetched all warehouses"));
});
