import * as dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || "5000",
  mongo: {
    uri: process.env.MONGODB_URI,
  },
};

export default config;
