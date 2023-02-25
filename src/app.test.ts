import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import createServer from "./utils/server";
import { build } from "@jackfranklin/test-data-bot";
import { faker } from "@faker-js/faker";
import User from "./models/user";

const app = createServer();
const request = supertest(app);
let mongoServer: MongoMemoryServer;
const userBuilder = build({
  fields: {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
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

test("GET /users", async () => {
  const newUser = new User(userBuilder());
  await newUser.save();

  const response = await request.get("/users");
  expect(response.body.length).toBeGreaterThan(0);
  expect(response.status).toBe(200);
});

test("GET /users/:id", async () => {
  const userInfo = userBuilder();
  const newUser = new User(userInfo);
  await newUser.save();

  const response = await request.get(`/users/${newUser._id}`);
  expect(response.status).toBe(200);
  expect(response.body).toMatchObject(userInfo);
});
