import { NextFunction, Request, Response } from "express";
import User from "../models/user";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  else return String(error);
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.logIn(registeredUser, (error) => {
      if (error) {
        next(error);
      } else {
        res.send({ message: "successfully registered user" });
      }
    });
  } catch (error) {
    res.status(404).send({ message: getErrorMessage(error) });
  }
}

export function login(req: Request, res: Response) {
  res.send({ message: "welcome back" });
}

export function logout(req: Request, res: Response, next: NextFunction) {
  req.logout((error) => {
    if (error) {
      next(error);
    } else {
      res.send("successfully logged out");
    }
  });
}
