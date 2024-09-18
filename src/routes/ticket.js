import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  createTicket,
  modifyTicket,
  usersTickets,
  deleteTicket,
  assignTicketToUser,
} from "../controllers/ticketController.js";

const ticketRoutes = express.Router();

ticketRoutes.post("/", authenticate, createTicket);
ticketRoutes.delete("/:ticketId", authenticate, deleteTicket);
ticketRoutes.get("/user", authenticate, usersTickets);
ticketRoutes.put("/:ticketId", authenticate, modifyTicket);
ticketRoutes.put("/:ticketId/assign", authenticate, assignTicketToUser);

//needs another route for just a single ticket

export default ticketRoutes;
