import { TicketModel } from '../models/Ticket';
import eventEmitter from './eventEmitter';

eventEmitter.on('ticketUpdated', (ticket: TicketModel) => {
  console.log(`Ticket ${ticket.seatNumber} updated`);
  //TODO: implement send notifications logic
});

eventEmitter.on('ticketCreated', (ticket: TicketModel) => {
  console.log(`New ticket created: ${ticket.seatNumber}`);
  //TODO: implement send notifications logic
});
