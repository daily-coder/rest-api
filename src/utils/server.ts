import express from "express";
import morgan from "morgan";
import userRoutes from "../routes/users";

function createServer() {
  const app = express();
  app.use(morgan("common"));
  app.use(express.urlencoded({ extended: true }));
  app.use("/users", userRoutes);
  return app;
}

export default createServer;
