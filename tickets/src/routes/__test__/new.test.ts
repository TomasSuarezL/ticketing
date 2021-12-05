import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).not.toBe(404);
});

it("can only be accessed if the user is signed in", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).toEqual(401);
});

it("can be accessed if the user is signed in", async () => {
  const cookie = signin();
  const response = await request(app).post("/api/tickets").set("Cookie", cookie).send({});

  expect(response.status).not.toEqual(401);
});

it("return error when invalid title", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "", price: 10 })
    .expect(400);

  await request(app).post("/api/tickets").set("Cookie", signin()).send({ price: 10 }).expect(400);
});
it("return error when invalid price", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "title", price: -10 })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "title" })
    .expect(400);
});
it("creates a ticket with valid input", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "title", price: 10 })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(10);
});

it("publishes an event", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "title", price: 10 })
    .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled()
});
