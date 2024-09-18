import mongoose from "mongoose";
import Comment from "../../../src/models/Comment";
import { MongoMemoryServer } from "mongodb-memory-server";

// Initialize MongoDB in-memory server
let mongoServer;
let connection;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  connection = await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Comment Model", () => {
  it("should not save a comment without required fields", async () => {
    const comment = new Comment({
      // Missing required fields for this test
    });

    try {
      await comment.save();
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.errors.commentText).toBeDefined();
      expect(error.errors.commentCreatorId).toBeDefined();
      expect(error.errors.ticketId).toBeDefined();
      return; // Exit test if error is caught
    }

    // Fail the test if no error is thrown
    throw new Error("Expected validation error but got none.");
  });

  it("should save a valid comment", async () => {
    const comment = new Comment({
      commentCreatorId: new mongoose.Types.ObjectId(),
      ticketId: new mongoose.Types.ObjectId(),
      commentText: "This is a comment",
    });

    const savedComment = await comment.save();

    expect(savedComment._id).toBeDefined();
    expect(savedComment.commentText).toBe("This is a comment");
    expect(savedComment.commentCreation).toBeDefined();
    expect(savedComment.commentCreatorId).toBeDefined();
    expect(savedComment.ticketId).toBeDefined();
  });
});
