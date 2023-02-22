import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/users";

mongoose
  .connect("mongodb://localhost:27017/demoApp")
  .then(() => console.log("MONGODB CONNECTED"))
  .catch((error) => console.log("MONGODB CONNECTION ERROR: ", error));

const app = express();

app.listen(3000, () => console.log("listening on port 3000"));
app.use("/users", userRoutes);
