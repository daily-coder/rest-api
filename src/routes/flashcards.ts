import { Request, Response, NextFunction, Router } from "express";
import * as flashcardController from "../controllers/flashcard";
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

router
  .route("/")
  .get(flashcardController.getAllFlashcards)
  .post(validateFlashcard, flashcardController.createFlashcard);

router
  .route("/:id")
  .get(flashcardController.getFlashcard)
  .put(validateFlashcard, flashcardController.updateFlashcard)
  .delete(flashcardController.deleteFlashcard);

export default router;
