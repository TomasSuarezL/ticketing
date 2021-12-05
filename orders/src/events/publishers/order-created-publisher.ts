import { OrderCreatedEvent, Publisher, Subjects } from "@tslticketing/common";


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}

