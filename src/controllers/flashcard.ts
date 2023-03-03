import { Request, Response } from "express";
import Flashcard from "../models/flashcard";

export async function getAllFlashcards(req: Request, res: Response) {
  const flashcards = await Flashcard.find();
  res.send(flashcards);
}

export async function getFlashcard(req: Request, res: Response) {
  const flashcard = await Flashcard.findById(req.params.id);
  if (!flashcard) {
    return res.status(404).send({ message: `flashcard not found` });
  }
  res.send(flashcard);
}

export async function createFlashcard(req: Request, res: Response) {
  const newFlashcard = new Flashcard(req.body);
  await newFlashcard.save();
  res.send({ message: "new flashcard created" });
}

export async function updateFlashcard(req: Request, res: Response) {
  await Flashcard.findByIdAndUpdate(req.params.id, req.body);
  res.send({ message: "flashcard updated" });
}

export async function deleteFlashcard(req: Request, res: Response) {
  await Flashcard.findByIdAndDelete(req.params.id);
  res.send({ message: "flashcard deleted" });
}
