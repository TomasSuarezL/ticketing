import { PaymentCreatedEvent, Publisher, Subjects } from "@tslticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}
