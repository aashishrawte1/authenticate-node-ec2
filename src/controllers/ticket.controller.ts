import { Request, Response } from 'express';
import eventEmitter from '../functions/eventEmitter';
import Ticket, { TicketModel } from '../models/Ticket';
import { connect } from '../utils/db.util';

export const updateTicketStatus = async (req: Request, res: Response) => {
  try {
    await connect();
    const { seatNumber, isOpen, userDetails } = req.body;

    if (seatNumber <= 0 || seatNumber > 40) {
      return res.status(400).json({ error: 'Invalid seat number' });
    }

    let ticket: TicketModel | null;
    console.log(seatNumber, isOpen, userDetails, req.body);

    if (isOpen) {
      ticket = await Ticket.findOneAndUpdate(
        { seatNumber, isOpen: false },
        { isOpen, $unset: { userDetails: 1 } },
        { new: true }
      );
    } else {
      if (!userDetails || !userDetails.name || !userDetails.email) {
        return res.status(400).json({ error: 'User details are required to close a ticket' });
      }

      ticket = await Ticket.findOneAndUpdate(
        { seatNumber, isOpen: true },
        { isOpen, userDetails },
        { new: true }
      );
    }

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found or already closed/open' });
    }

    eventEmitter.emit('ticketUpdated', ticket);

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const viewTicketStatus = async (req: Request, res: Response) => {
  try {
    await connect();
    const seatNumber = Number(req.params.seatNumber);

    if (seatNumber <= 0 || seatNumber > 40) {
      return res.status(400).json({ error: 'Invalid seat number' });
    }

    const ticket = await Ticket.findOne({ seatNumber });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const viewAllClosedTickets = async (_req: Request, res: Response) => {
  try {
    await connect();
    const closedTickets = await Ticket.find({ isOpen: false });

    res.json(closedTickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const viewAllOpenTickets = async (_req: Request, res: Response) => {
  try {
    await connect();
    const openTickets = await Ticket.find({ isOpen: true });

    res.json(openTickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const viewDetailsOfPerson = async (req: Request, res: Response) => {
  try {
    await connect();
    const seatNumber = Number(req.params.seatNumber);

    if (seatNumber <= 0 || seatNumber > 40) {
      return res.status(400).json({ error: 'Invalid seat number' });
    }

    const ticket = await Ticket.findOne({ seatNumber, isOpen: false });

    if (!ticket || !ticket.userDetails) {
      return res.status(404).json({ error: 'Ticket not found or user details not available' });
    }

    res.json(ticket.userDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createTicket = async(req: Request, res: Response) => {
  try {
    await connect();
    const { seatNumber, userDetails } = req.body;

    if(seatNumber <= 0 || seatNumber > 40) {
      return res.status(400).json({ error: 'Invalid seat number' });
    }

    const existingTicket = await Ticket.findOne({ seatNumber });
    if(existingTicket && existingTicket.isOpen == false) {
      return res.status(400).json({ error: 'Seat is already occupied' });
    } else if(existingTicket && existingTicket.isOpen) {
      await Ticket.deleteMany({ seatNumber });
    }

    const totalBookedSeats = await Ticket.countDocuments({ isOpen: false });

    if(totalBookedSeats >= 40) {
      return res.status(400).json({ error: 'Bus is fully booked' });
    }

    if(!userDetails || !userDetails.name || !userDetails.email ) {
      return res.status(400).json({ error: 'User details are required to create a ticket' });
    }

      const ticket = new Ticket({
        seatNumber,
        isOpen: false,
        userDetails
      });
  
      await ticket.save();
    
    eventEmitter.emit('ticketCreated', ticket);

    res.json(ticket);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
}
