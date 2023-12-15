/* eslint-disable @typescript-eslint/no-explicit-any */

import Ticket from "../models/Ticket";
import { connect } from "../utils/db.util";

/* eslint-disable @typescript-eslint/no-unused-vars */
export const resetServer  = async(req: any, res: any) => {
    try {
        await connect();
        await Ticket.updateMany({}, {isOpen: true, userDetails: undefined});
        res.json({ message: 'Server reset successfully'});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}