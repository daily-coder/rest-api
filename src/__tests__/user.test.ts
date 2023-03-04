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
