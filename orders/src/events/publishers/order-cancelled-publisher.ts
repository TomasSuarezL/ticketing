import { OrderCancelledEvent,  Publisher, Subjects } from "@tslticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}

