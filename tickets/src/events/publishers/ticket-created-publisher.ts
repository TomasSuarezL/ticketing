import {Publisher, Subjects, TicketCreatedEvent } from '@tslticketing/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated;
}
