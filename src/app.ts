import mongoose from "mongoose";
import createServer from "./utils/server";

mongoose
  .connect("mongodb://localhost:27017/demoApp")
  .then(() => console.log("MONGODB CONNECTED"))
  .catch((error) => console.log("MONGODB CONNECTION ERROR: ", error));

const app = createServer();

app.listen(3000, () => console.log("listening on port 3000"));
