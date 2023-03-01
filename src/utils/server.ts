import express from "express";
import morgan from "morgan";
import userRoutes from "../routes/users";
import flashcardRoutes from "../routes/flashcards";

function createServer() {
  const app = express();
  app.use(morgan("dev"));
  app.use(express.urlencoded({ extended: true }));
  app.use("/users", userRoutes);
  app.use("/flashcards", flashcardRoutes);
  return app;
}

export default createServer;
