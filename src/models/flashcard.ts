import mongoose from "mongoose";

const flashcardSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

const Flashcard = mongoose.model("flashcard", flashcardSchema);

export default Flashcard;
