import mongoose from "mongoose";
import User from "../models/user";
import USERS from "./users";

mongoose
  .connect("mongodb://localhost:27017/demoApp")
  .then(() => console.log("MONGODB CONNECTED"))
  .catch((error) => console.log("MONGODB CONNECTION ERROR: ", error));

User.deleteMany()
  .then((result) => console.log(result))
  .catch((error) => console.log(error));

User.insertMany(USERS)
  .then(() => mongoose.connection.close())
  .catch((error) => {
    mongoose.connection.close();
    console.log(error);
  });
