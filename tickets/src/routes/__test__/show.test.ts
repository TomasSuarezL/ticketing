import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("it returns 404 if ticket not found", async () => {
  await request(app)
    .get("/api/tickets/" + new mongoose.Types.ObjectId().toHexString())
    .set("Cookie", signin())
    .send()
    .expect(404);
});

it("returns the ticket if ticket is found", async () => {
  const title = "title";
  const price = 20;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .set("Cookie", signin())
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
