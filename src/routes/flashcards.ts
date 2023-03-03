import { Router } from "express";
import * as flashcardController from "../controllers/flashcard";
import validateFlashcard from "../middleware/validateFlashcard";

const router = Router();

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
