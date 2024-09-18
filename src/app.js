import express from "express";
import "./config/database.js";
import authRoutes from "./routes/auth.js";
import ticketRoutes from "./routes/ticket.js";
import errorHandler from "./middleware/errorHandler.js";
import commentRoutes from "./routes/comment.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/ticket", ticketRoutes);
app.use("/ticket", commentRoutes);

app.use(errorHandler);
export default app;
