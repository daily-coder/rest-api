import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import createServer from "../utils/server";
import { build } from "@jackfranklin/test-data-bot";
import { faker } from "@faker-js/faker";
import Flashcard from "../models/flashcard";

const app = createServer();
const request = supertest(app);
let mongoServer: MongoMemoryServer;
const flashcardBuilder = build({
  fields: {
    question: faker.lorem.paragraph(),
    answer: faker.lorem.paragraph(),
  },
});

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

test("GET | return all flashcards from database", async () => {
  const flashcardInfo = flashcardBuilder();
  const newFlashcard = new Flashcard(flashcardInfo);
  await newFlashcard.save();

  const response = await request.get("/flashcards");
  expect(response.status).toBe(200);
  expect(response.body.length).toBeGreaterThan(0);
  // newFlashcard contains additional methods like save, so don't use it to compare
  // returned flashcard object in response.body
  expect(response.body).toContainEqual(expect.objectContaining(flashcardInfo));
});

test("GET | return a flashcard from database", async () => {
  const flashcardInfo = flashcardBuilder();
  const newFlashcard = new Flashcard(flashcardInfo);
  await newFlashcard.save();

  const response = await request.get(`/flashcards/${newFlashcard._id}`);
  expect(response.status).toBe(200);
  expect(response.body).toEqual(expect.objectContaining(flashcardInfo));
});

test("POST | save a flashcard to database", async () => {
  const flashcardInfo = flashcardBuilder();
  const response = await request
    .post(`/flashcards`)
    .send(`question=${flashcardInfo.question}&answer=${flashcardInfo.answer}`);
  expect(response.status).toBe(200);
  expect(response.body.message).toMatchInlineSnapshot(
    `"new flashcard created"`
  );

  const flashcardsResponse = await request.get("/flashcards");
  expect(flashcardsResponse.status).toBe(200);
  expect(flashcardsResponse.body.length).toBeGreaterThan(0);
  expect(flashcardsResponse.body).toContainEqual(
    expect.objectContaining(flashcardInfo)
  );
});

test("DELETE | delete a flashcard from database", async () => {
  const flashcardInfo = flashcardBuilder();
  const newFlashcard = new Flashcard(flashcardInfo);
  await newFlashcard.save();

  const response = await request.delete(`/flashcards/${newFlashcard._id}`);
  expect(response.status).toBe(200);
  expect(response.body.message).toMatchInlineSnapshot(`"flashcard deleted"`);

  const flashcardsResponse = await request.get("/flashcards");
  expect(flashcardsResponse.status).toBe(200);
  expect(flashcardsResponse.body).not.toContainEqual(
    expect.objectContaining(flashcardInfo)
  );
});
