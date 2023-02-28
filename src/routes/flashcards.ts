import { Router } from "express";
import Flashcard from "../models/flashcard";

const router = Router();

router.get("/", async (req, res) => {
  const flashcards = await Flashcard.find();
  res.send(flashcards);
});

export default router;
