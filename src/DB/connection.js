import mongoose from "mongoose";
import { DB_URI} from "../config/configService.js";
import chalk from "chalk";

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(chalk.bgRgb(0, 170, 0)(`Connected to MongoDB successfully`));
  } catch (error) {
    console.error(chalk.bgRgb(255, 0, 0)(`Failed to connect to MongoDB: ${error.message}`));
  }
};

export default connectDB;