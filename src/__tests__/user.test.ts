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

test("POSt | register new user", async () => {
  const { username, email, password } = userBuilder();
  const { status, body } = await request
    .post("/register")
    .send(`username=${username}&email=${email}&password=${password}`);

  expect(status).toBe(200);
  expect(body.message).toMatchInlineSnapshot(`"successfully registered user"`);
});
