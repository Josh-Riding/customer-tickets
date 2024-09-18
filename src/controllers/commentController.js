import Comment from "../models/Comment.js";
import mongoose from "mongoose";

//create new comment on a ticket
export const newComment = async (req, res, next) => {
  try {
    const { commentText } = req.body;
    const { ticketId } = req.params;

    const commentCreatorId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(commentCreatorId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const comment = new Comment({
      commentCreatorId,
      commentCreation: Date.now(),
      ticketId,
      commentText,
    });
    await comment.save();
    res.status(201).json({ message: "Comment created successfully" });
  } catch (error) {
    next(error);
  }
};

//get all comments for a ticket
export const ticketsComments = async (req, res, next) => {
  try {
    const { ticketId } = req.params;

    const result = await Comment.find({ ticketId: ticketId });

    res.status(200).json({ message: result });
  } catch (error) {
    next(error);
  }
};
