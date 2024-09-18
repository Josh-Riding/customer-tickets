//implement CRUD ops
import Ticket from "../models/Ticket.js";
import mongoose from "mongoose";
import { assignTicket } from "../services/ticketService.js";

export const createTicket = async (req, res, next) => {
  try {
    const {
      ticketSubject,
      ticketDescription,
      ticketCompleted,
      ticketAssignedId,
    } = req.body;

    const ticketCreatorId = req.user._id;

    const ticket = new Ticket({
      ticketSubject,
      ticketDescription,
      ticketCreatorId,
      ticketCompleted,
      ticketCreation: Date.now(),
      ticketAssignedId,
    });
    await ticket.save();
    res.status(201).json({ message: "Ticket created successfully" });
  } catch (error) {
    next(error);
  }
};

//get tickets for a user

export const usersTickets = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const tickets = await Ticket.find({ ticketCreatorId: userId });

    if (!tickets || tickets.length === 0) {
      return res
        .status(404)
        .json({ message: "No tickets found for this user" });
    }
    res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
};
//modify a ticket

export const modifyTicket = async (req, res, next) => {
  try {
    const { ticketId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({ message: "Invalid Ticket ID" });
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res
      .status(200)
      .json({ message: "Ticket updated successfully", updatedTicket });
  } catch (error) {
    next(error);
  }
};

//delete a ticket

export const deleteTicket = async (req, res, next) => {
  try {
    const { ticketId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({ message: "Invalid Ticket ID" });
    }

    const result = await Ticket.deleteOne({ _id: ticketId });

    if (result.deletedCount === 0) {
      res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json("Ticket Deleted Successfully");
  } catch (error) {
    next(error);
  }
};

export const assignTicketToUser = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { userId } = req.body;

    const updatedTicket = await assignTicket(ticketId, userId);
    res
      .status(200)
      .json({ message: "Ticket assigned successfully", ticket: updatedTicket });
  } catch (error) {
    next(error);
  }
};
