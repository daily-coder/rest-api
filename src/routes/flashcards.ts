import { Request, Response, NextFunction, Router } from "express";
import Flashcard from "../models/flashcard";
import flashcardSchema from "../schemas/flashcard";

const router = Router();

function validateFlashcard(req: Request, res: Response, next: NextFunction) {
  const { error } = flashcardSchema.validate(req.body);
  if (error) {
    const message = error.details.map((detail) => detail.message).join(",");
    return res.status(400).send({ message });
  }
  next();
}

router.get("/", async (req, res) => {
  const flashcards = await Flashcard.find();
  res.send(flashcards);
});

router.get("/:id", async (req, res) => {
  const flashcard = await Flashcard.findById(req.params.id);
  if (!flashcard) {
    return res.status(404).send({ message: `flashcard not found` });
  }
  res.send(flashcard);
});

router.post("/", validateFlashcard, async (req, res) => {
  const newFlashcard = new Flashcard(req.body);
  await newFlashcard.save();
  res.send({ message: "new flashcard created" });
});

router.put("/:id", validateFlashcard, async (req, res) => {
  await Flashcard.findByIdAndUpdate(req.params.id, req.body);
  res.send({ message: "flashcard updated" });
});

router.delete("/:id", async (req, res) => {
  await Flashcard.findByIdAndDelete(req.params.id);
  res.send({ message: "flashcard deleted" });
});

export default router;
