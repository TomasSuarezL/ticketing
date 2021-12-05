import {Publisher, Subjects, TicketUpdatedEvent } from '@tslticketing/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    readonly subject = Subjects.TicketUpdated;
}
