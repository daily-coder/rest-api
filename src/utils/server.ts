import dotenv from "dotenv";
dotenv.config();
import express from "express";
import "express-async-errors";
import morgan from "morgan";
import userRoutes from "../routes/users";
import flashcardRoutes from "../routes/flashcards";
import errorHandler from "../middleware/errorHandler";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/user";

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
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  app.use(morgan("dev"));
  app.use(express.urlencoded({ extended: true }));
  app.use("/", userRoutes);
  app.use("/flashcards", flashcardRoutes);
  app.all("*", (req, res) => {
    res.status(404).send({ message: "Not Found" });
  });
  app.use(errorHandler);
  return app;
}

export default createServer;
