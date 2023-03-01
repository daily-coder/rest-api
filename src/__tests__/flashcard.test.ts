import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import createServer from "../utils/server";
import { build, perBuild } from "@jackfranklin/test-data-bot";
import { faker } from "@faker-js/faker";
import Flashcard from "../models/flashcard";

const app = createServer();
const request = supertest(app);
let mongoServer: MongoMemoryServer;
const flashcardBuilder = build({
  fields: {
    question: perBuild(() => faker.lorem.paragraph()),
    answer: perBuild(() => faker.lorem.paragraph()),
  },
});

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  mongoose.set("strictQuery", false);
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

  const response = await request.get("/flashcards");
  expect(response.status).toBe(200);
  expect(response.body.length).toBeGreaterThan(0);
  expect(response.body).toContainEqual(expect.objectContaining(newFlashcard));
});

test("GET | return a flashcard from database", async () => {
  const newFlashcard = await setup();

  const response = await request.get(`/flashcards/${newFlashcard._id}`);
  expect(response.status).toBe(200);
  expect(response.body).toEqual(expect.objectContaining(newFlashcard));
});

test("POST | save a flashcard to database", async () => {
  const flashcardProps = flashcardBuilder();

  const response = await request
    .post(`/flashcards`)
    .send(
      `question=${flashcardProps.question}&answer=${flashcardProps.answer}`
    );
  expect(response.status).toBe(200);
  expect(response.body.message).toMatchInlineSnapshot(
    `"new flashcard created"`
  );

  const flashcardsResponse = await request.get("/flashcards");
  expect(flashcardsResponse.body).toContainEqual(
    expect.objectContaining(flashcardProps)
  );
});

test("PUT | update a flashcard from database", async () => {
  const newFlashcard = await setup();
  const updateProps = flashcardBuilder();

  const response = await request
    .put(`/flashcards/${newFlashcard._id}`)
    .send(`question=${updateProps.question}&answer=${updateProps.answer}`);
  expect(response.status).toBe(200);
  expect(response.body.message).toMatchInlineSnapshot(`"flashcard updated"`);

  const flashcardResponse = await request.get(
    `/flashcards/${newFlashcard._id}`
  );
  expect(flashcardResponse.body).not.toEqual(
    expect.objectContaining(newFlashcard)
  );
});

test("DELETE | delete a flashcard from database", async () => {
  const newFlashcard = await setup();

  const response = await request.delete(`/flashcards/${newFlashcard._id}`);
  expect(response.status).toBe(200);
  expect(response.body.message).toMatchInlineSnapshot(`"flashcard deleted"`);

  const flashcardsResponse = await request.get("/flashcards");
  expect(flashcardsResponse.body).not.toContainEqual(
    expect.objectContaining(newFlashcard)
  );
});
