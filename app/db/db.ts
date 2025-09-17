import mongoose from "mongoose";
import config from "../config/config";

export const connectDB = async () => {
  try {
    const mongoURI = config.mongo.uri;
    const conn = await mongoose.connect(mongoURI!);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
