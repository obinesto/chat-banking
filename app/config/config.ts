import * as dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || "5000",
  mongo: {
    uri: process.env.MONGODB_URI,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
  },
};

export default config;
