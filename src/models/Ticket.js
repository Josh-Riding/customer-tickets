import mongoose from "mongoose";

export const ticketSchema = new mongoose.Schema({
  ticketSubject: {
    type: String,
    required: true,
  },
  ticketDescription: {
    type: String,
    required: true,
  },
  ticketCreation: {
    type: Number,
    default: Date.now(),
  },
  ticketCreatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ticketAssignedId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  ticketCompleted: {
    type: Boolean,
    required: true,
  },
});

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
