import Joi from "joi";

const flashcardSchema = Joi.object({
  question: Joi.string().required(),
  answer: Joi.string().required(),
});

export default flashcardSchema;
