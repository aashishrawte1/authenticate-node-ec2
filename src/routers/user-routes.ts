
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
    reset: '/admin/reset',

    // ticket routes
    update: '/user/update', // update ticket status
    'seat-status': '/user/status/:seatNumber', // view ticket status
    closed: '/user/closed', // all closed tickets
    open: '/user/open', // all open tickets
    details: '/user/details/:seatNumber', // details of person and ticket
    'create-ticket': '/user/create-ticket', // create ticket


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