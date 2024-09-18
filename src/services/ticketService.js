import Ticket from "../models/Ticket.js";
import User from "../models/User.js";

export const assignTicket = async (ticketId, userId) => {
  try {
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new Error("Ticket not found");
    }
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }
    ticket.ticketAssignedId.push(user._id);

    await ticket.save();
    return ticket;
  } catch (error) {
    throw error;
  }
};
