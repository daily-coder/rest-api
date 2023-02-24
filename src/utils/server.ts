import express from "express";
import userRoutes from "../routes/users";

function createServer() {
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use("/users", userRoutes);
  return app;
}

export default createServer;
