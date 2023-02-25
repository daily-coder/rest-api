import { Router } from "express";
import User from "../models/user";

const router = Router();

router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.send(user);
});

export default router;
