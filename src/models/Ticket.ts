import mongoose, { Document } from "mongoose";

export interface TicketModel extends Document {
    seatNumber: number;
    isOpen: boolean;
    userDetails?: {
        name: string;
        email?: string;
    };
}

const ticketSchema = new mongoose.Schema({
    seatNumber: { type: Number, required: true, unique: true },
    isOpen: { type: Boolean, default: true },
    userDetails: {
        name: { type: String },
        email: { type: String }
    }
});

const Ticket = mongoose.model<TicketModel>('Ticket', ticketSchema);
export default Ticket;