import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const port = process.env.MONGODB_URL || "mongodb://localhost:27017/demoApp";

async function connect() {
  try {
    await mongoose.connect(port);
    console.log("MONGODB CONNECTED");
  } catch (error) {
    console.log("MONGODB CONNECTION ERROR: ", error);
  }
}

export default connect;
