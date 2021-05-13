// const request = require("supertest");
// const app = require("../app");
// const fs = require("fs/promises");

// describe("should handle PATCH request", () => {
//   test("should return 200 status for PATCH: /users/avatar", async (done) => {
//     const buffer = await fs.readFile("./test/default-avatar-female.jpg");
//     const res = await request(app)
//       .patch("/api/users/avatars")
//       .set("Authorization", `Bearer ${token}`)
//       .attach("avatar", buffer, "default-avatar-female.jpg");

//     expect(res.status).toEqual(200);
//     expect(res.body).toBeDefined();
//     expect(res.body.data.avatarUrl).toEqual("secure_url_cloudinary");
//     done();
//   });
// });
