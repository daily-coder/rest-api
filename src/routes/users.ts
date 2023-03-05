import { Router } from "express";
import passport from "passport";
import * as userController from "../controllers/user";

const router = Router();

router.post("/register", userController.register);

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
  }),
  userController.login
);

router.get("/logout", userController.logout);

export default router;
