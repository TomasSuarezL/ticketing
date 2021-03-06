import request from "supertest";
import { app } from "../../app";

it("Returns a 201 on successful signup", async () => {
  return request(app)
    .post(`/api/users/signup`)
    .send({ email: `test@user.com`, password: "passawordo" })
    .expect(201);
});

it("Returns a 400 with an invalid email", async () => {
  return request(app)
    .post(`/api/users/signup`)
    .send({ email: `test.com`, password: "passawordo" })
    .expect(400);
});

it("Returns a 400 with an invalid password", async () => {
  return request(app)
    .post(`/api/users/signup`)
    .send({ email: `test@user.com`, password: "" })
    .expect(400);
});

it("Returns a 400 with missing email and password", async () => {
  return request(app).post(`/api/users/signup`).send({}).expect(400);
});

it("Disallows duplicate emails", async () => {
  await request(app)
    .post(`/api/users/signup`)
    .send({ email: "test@test.com", password: "passawordo" })
    .expect(201);

  await request(app)
    .post(`/api/users/signup`)
    .send({ email: "test@test.com", password: "passawordo" })
    .expect(400);

});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post(`/api/users/signup`)
    .send({ email: "user@test.com", password: "passawordo" })
    .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
});
