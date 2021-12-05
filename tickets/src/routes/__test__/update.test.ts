import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

const createTicket = (cookie) => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "askdj", price: 20 });
};

it("returns a 404 if the provided id does not exist", async () => {
  await request(app)
    .put("/api/tickets/" + new mongoose.Types.ObjectId().toHexString())
    .set("Cookie", signin())
    .send({ title: "askad", price: 25 })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  await request(app)
    .put("/api/tickets/" + new mongoose.Types.ObjectId().toHexString())
    .send({ title: "askad", price: 25 })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const response = await createTicket(signin());

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", signin())
    .send({ title: "assd", price: 1000 })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = signin();
  const response = await createTicket(cookie);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 100,
    })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "asdjasd",
      price: -100,
    })
    .expect(400);
});

it("updates ticket provided valid inputs", async () => {
  const cookie = signin();
  const response = await createTicket(cookie);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new Title",
      price: 100,
    })
    .expect(200);

  const ticket = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send();

  expect(ticket.body.title).toEqual("new Title");
  expect(ticket.body.price).toEqual(100);
});

it("publishes an event", async () => {
  const cookie = signin();
  const response = await createTicket(cookie);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new Title",
      price: 100,
    })
    .expect(200);

  await request(app).get(`/api/tickets/${response.body.id}`).set("Cookie", cookie).send();

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("rejects updates if the ticket is reserved", async () => {
  const cookie = signin();
  const response = await createTicket(cookie);

  const ticket = await Ticket.findById(response.body.id);
  ticket.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();


  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new Title",
      price: 100,
    })
    .expect(400);
});
