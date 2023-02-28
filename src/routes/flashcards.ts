import { Router } from "express";
import Flashcard from "../models/flashcard";

const router = Router();

router.get("/", async (req, res) => {
  const flashcards = await Flashcard.find();
  res.send(flashcards);
});

router.get("/:id", async (req, res) => {
  const flashcard = await Flashcard.findById(req.params.id);
  res.send(flashcard);
});

router.post("/", async (req, res) => {
  const newFlashcard = new Flashcard(req.body);
  await newFlashcard.save();
  res.send({ message: "new flashcard created" });
});

export default router;
