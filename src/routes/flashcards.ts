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

router.put("/:id", async (req, res) => {
  await Flashcard.findByIdAndUpdate(req.params.id, req.body);
  res.send({ message: "flashcard updated" });
});

router.delete("/:id", async (req, res) => {
  await Flashcard.findByIdAndDelete(req.params.id);
  res.send({ message: "flashcard deleted" });
});

export default router;
