import mongoose from "mongoose";

async function connect() {
  try {
    await mongoose.connect("mongodb://localhost:27017/demoApp");
    console.log("MONGODB CONNECTED");
  } catch (error) {
    console.log("MONGODB CONNECTION ERROR: ", error);
  }
}

export default connect;
