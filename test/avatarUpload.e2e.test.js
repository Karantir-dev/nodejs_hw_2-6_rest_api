const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const fs = require("fs/promises");
const User = require("../model/__mocks__/data");
require("dotenv").config();

jest.mock("../model/users.js");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const issueToken = (payload, secret) => jwt.sign(payload, secret);
const token = issueToken({ id: User.id }, JWT_SECRET_KEY);
User.token = token;

describe("should handle PATCH request", () => {
  test("should return 200 for PATCH: /users/avatars", async (done) => {
    const buffer = await fs.readFile("./test/photo.jpg");
    const res = await request(app)
      .patch("/api/users/avatars")
      .set("Authorization", `Bearer ${token}`)
      .attach("avatar", buffer, "photo1.jpg");

    expect(res.status).toEqual(200);
    expect(res.body).toBeDefined();
    expect(res.body.ResponseBody.avatarURL).toEqual(User.avatarURL);
    done();
  });

  test("should return 401 for PATCH: /users/avatars", async (done) => {
    const buffer = await fs.readFile("./test/photo.jpg");
    const res = await request(app)
      .patch("/api/users/avatars")
      .set("Authorization", `Bearer ${null}`)
      .attach("avatar", buffer, "photo1.jpg");

    expect(res.status).toEqual(401);
    expect(res.body).toBeDefined();
    expect(res.body.ResponseBody.message).toEqual("Not authorized");
    done();
  });
});
