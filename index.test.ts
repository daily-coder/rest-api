import supertest from "supertest";

const request = supertest("localhost:3000");

test("GET /users", async () => {
  const response = await request.get("/users");
  expect(response.body).toHaveLength(2);
  expect(response.status).toBe(200);
});
