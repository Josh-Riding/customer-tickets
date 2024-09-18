import mongoose from "mongoose";

export const commentSchema = new mongoose.Schema({
  commentCreatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  commentCreation: {
    type: Number,
    default: Date.now,
  },
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    required: true,
  },
  commentText: {
    type: String,
    required: true,
  },
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
