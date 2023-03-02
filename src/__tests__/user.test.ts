import supertest from "supertest";
import { build } from "@jackfranklin/test-data-bot";
import { faker } from "@faker-js/faker";
import createServer from "../utils/server";
import User from "../models/user";

const app = createServer();
const request = supertest(app);
const userBuilder = build({
  fields: {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  },
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
