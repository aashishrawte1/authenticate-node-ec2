
import express from "express";
import { resetServer } from "../controllers/admin.controller";
import {
    createTicket,
    updateTicketStatus,
    viewAllClosedTickets,
    viewAllOpenTickets,
    viewDetailsOfPerson,
    viewTicketStatus
} from './../controllers/ticket.controller';
export const server = express.Router()

const routes = {

    // admin routes
    reset: '/reset',

    // ticket routes
    update: '/update', // update ticket status
    'seat-status': '/status/:seatNumber', // view ticket status
    closed: '/closed', // all closed tickets
    open: '/open', // all open tickets
    details: '/details/:seatNumber', // details of person and ticket
    'create-ticket': '/create-ticket', // create ticket


}

// admin apis
server.post(routes.reset, resetServer);

// ticket apis
server.put(routes.update, updateTicketStatus);
server.get(routes['seat-status'], viewTicketStatus);
server.get(routes.closed, viewAllClosedTickets);
server.get(routes.open, viewAllOpenTickets);
server.get(routes.details, viewDetailsOfPerson);
server.post(routes['create-ticket'], createTicket);