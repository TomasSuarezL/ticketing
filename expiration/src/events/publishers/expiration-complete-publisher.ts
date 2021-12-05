import { ExpirationCompleteEvent, Publisher, Subjects } from "@tslticketing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete
}
