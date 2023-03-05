import { Router } from "express";
import User from "../models/user";

const router = Router();

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  else return String(error);
}

router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.logIn(registeredUser, (error) => {
      if (error) {
        next(error);
      } else {
        res.send({ message: `successfully registered user: ${username}` });
      }
    });
  } catch (error) {
    res.status(404).send({ message: getErrorMessage(error) });
  }
});

export default router;
