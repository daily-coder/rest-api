import express from "express";
import morgan from "morgan";
import userRoutes from "../routes/users";
import flashcardRoutes from "../routes/flashcards";
import errorHandler from "../middleware/errorHandler";
import session from "express-session";

const sessionKey = process.env.SESSION_SECRET;

if (!sessionKey) {
  throw new Error("session key is required");
}

const sessionConfig = {
  secret: sessionKey,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

function createServer() {
  const app = express();
  app.use(session(sessionConfig));
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
