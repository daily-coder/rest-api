import supertest from "supertest";
import { build, perBuild } from "@jackfranklin/test-data-bot";
import { faker } from "@faker-js/faker";
import createServer from "../utils/server";
import Flashcard from "../models/flashcard";

const app = createServer();
const request = supertest(app);
const flashcardBuilder = build({
  fields: {
    question: perBuild(() => faker.lorem.paragraph()),
    answer: perBuild(() => faker.lorem.paragraph()),
  },
});

async function setup() {
  const flashcardProps = flashcardBuilder();
  const newFlashcard = new Flashcard(flashcardProps);
  await newFlashcard.save();
  // Note: don't use newFlashcard.toObject() as it doesn't convert _id: ObjectId
  // into string
  return JSON.parse(JSON.stringify(newFlashcard));
}

test("GET | return all flashcards from database", async () => {
  const newFlashcard = await setup();
  const { status, body } = await request.get("/flashcards");

  expect(status).toBe(200);
  expect(body.length).toBeGreaterThan(0);
  expect(body).toContainEqual(expect.objectContaining(newFlashcard));
});

test("GET | return a flashcard from database", async () => {
  const newFlashcard = await setup();
  const { status, body } = await request.get(`/flashcards/${newFlashcard._id}`);

  expect(status).toBe(200);
  expect(body).toEqual(expect.objectContaining(newFlashcard));
});

test("POST | save a flashcard to database", async () => {
  const flashcardProps = flashcardBuilder();
  const { status, body } = await request
    .post(`/flashcards`)
    .send(
      `question=${flashcardProps.question}&answer=${flashcardProps.answer}`
    );

  expect(status).toBe(200);
  expect(body.message).toMatchInlineSnapshot(`"new flashcard created"`);

  const flashcards = await request.get("/flashcards");

  expect(flashcards.body).toContainEqual(
    expect.objectContaining(flashcardProps)
  );
});

test("PUT | update a flashcard from database", async () => {
  const newFlashcard = await setup();
  const updateProps = flashcardBuilder();
  const { status, body } = await request
    .put(`/flashcards/${newFlashcard._id}`)
    .send(`question=${updateProps.question}&answer=${updateProps.answer}`);

  expect(status).toBe(200);
  expect(body.message).toMatchInlineSnapshot(`"flashcard updated"`);

  const flashcard = await request.get(`/flashcards/${newFlashcard._id}`);

  expect(flashcard.body).not.toEqual(expect.objectContaining(newFlashcard));
});

test("DELETE | delete a flashcard from database", async () => {
  const newFlashcard = await setup();
  const { status, body } = await request.delete(
    `/flashcards/${newFlashcard._id}`
  );

  expect(status).toBe(200);
  expect(body.message).toMatchInlineSnapshot(`"flashcard deleted"`);

  const flashcards = await request.get("/flashcards");

  expect(flashcards.body).not.toContainEqual(
    expect.objectContaining(newFlashcard)
  );
});
