import { Request, Response, NextFunction } from "express";
import flashcardSchema from "../schemas/flashcard";

function validateFlashcard(req: Request, res: Response, next: NextFunction) {
  const { error } = flashcardSchema.validate(req.body);
  if (error) {
    const message = error.details.map((detail) => detail.message).join(",");
    return res.status(400).send({ message });
  }
  next();
}

export default validateFlashcard;
