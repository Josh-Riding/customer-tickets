import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  newComment,
  ticketsComments,
} from "../controllers/commentController.js";

const commentRoutes = express.Router();

commentRoutes.post("/:ticketId", authenticate, newComment);
commentRoutes.get("/:ticketId", authenticate, ticketsComments);

export default commentRoutes;
