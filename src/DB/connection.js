import mongoose from "mongoose";
import { DB_URL } from "../config/configService.js";

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("connected to MongoDB Failed:", error);
  }
};

export default connectDB;