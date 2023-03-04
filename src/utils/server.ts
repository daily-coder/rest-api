import express from "express";
import morgan from "morgan";
import userRoutes from "../routes/users";
import flashcardRoutes from "../routes/flashcards";
import errorHandler from "../middleware/errorHandler";

function createServer() {
  const app = express();
  app.use(morgan("dev"));
  app.use(express.urlencoded({ extended: true }));
  app.use("/users", userRoutes);
  app.use("/flashcards", flashcardRoutes);
  app.all("*", (req, res) => {
    res.status(404).send({ message: "Not Found" });
  });
  app.use(errorHandler);
  return app;
}

export default createServer;
