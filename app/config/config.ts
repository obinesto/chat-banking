import * as dotenv from "dotenv";
dotenv.config();

const envConfig = {
  port: process.env.PORT || "5000",
  mongo: {
    uri: process.env.MONGODB_URI,
  },
};

export default envConfig;
