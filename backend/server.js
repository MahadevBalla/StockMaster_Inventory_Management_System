import express from "express";
import mongoose, { connect } from "mongoose";
import dotenv from "dotenv";
// @ts-ignore
import connectDB from "./db/db.js";
import app from "./app.js";
import { Server } from "socket.io";

dotenv.config();

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed", err);
  });
