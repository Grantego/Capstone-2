"use strict";

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /auth/token */

describe("POST /auth/token", function () {
  test("works", async function () {
    const res = await request(app)
        .post("/auth/token")
        .send({
          username: "testuser",
          password: "testpass",
        });
    expect(res.body).toEqual({
      "token": expect.any(String),
    });
  });

  test("unauth with non-existent user", async function () {
    const res = await request(app)
        .post("/auth/token")
        .send({
          username: "no-such-user",
          password: "password1",
        });
    expect(res.statusCode).toEqual(401);
  });

  test("unauth with wrong password", async function () {
    const res = await request(app)
        .post("/auth/token")
        .send({
          username: "testuser",
          password: "nope",
        });
    expect(res.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const res = await request(app)
        .post("/auth/token")
        .send({
          username: "testuser",
        });
    expect(res.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const res = await request(app)
        .post("/auth/token")
        .send({
          username: 42,
          password: "above-is-a-number",
        });
    expect(res.statusCode).toEqual(400);
  });
});

/************************************** POST /auth/register */

describe("POST /auth/register", function () {
  test("works for anon", async function () {
    const res = await request(app)
        .post("/auth/register")
        .send({
          username: "new",
          password: "password",
          email: "new@email.com",
        });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      "token": expect.any(String),
    });
  });

  test("bad request with missing fields", async function () {
    const res = await request(app)
        .post("/auth/register")
        .send({
          username: "new",
        });
    expect(res.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const res = await request(app)
        .post("/auth/register")
        .send({
          username: "new",
          password: "password",
          email: "not-an-email",
        });
    expect(res.statusCode).toEqual(400);
  });
});
