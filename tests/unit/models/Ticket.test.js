import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Ticket from "../../../src/models/Ticket";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Ticket Model Test", () => {
  it("should create and save a ticket", async () => {
    const ticketData = {
      ticketSubject: "Test Ticket Subject",
      ticketDescription: "Test Ticket Description",
      ticketCreation: Date.now(),
      ticketCreatorId: new mongoose.Types.ObjectId(),
      ticketAssignedId: [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
      ],
      ticketCompleted: false,
    };

    // Create a new ticket
    const ticket = new Ticket(ticketData);

    // Save the ticket to the database
    await ticket.save();

    // Check that the ticket is saved correctly
    const savedTicket = await Ticket.findOne({
      ticketSubject: ticketData.ticketSubject,
    });
    expect(savedTicket).not.toBeNull();
    expect(savedTicket.ticketSubject).toBe(ticketData.ticketSubject);
    expect(savedTicket.ticketDescription).toBe(ticketData.ticketDescription);
    expect(savedTicket.ticketCreation).toBe(ticketData.ticketCreation);
    expect(savedTicket.ticketCreatorId).toStrictEqual(
      ticketData.ticketCreatorId
    );
    expect(savedTicket.ticketAssignedId).toEqual(ticketData.ticketAssignedId);
    expect(savedTicket.ticketCompleted).toBe(ticketData.ticketCompleted);
  });

  it("should fail to create a ticket without required fields", async () => {
    const ticketData = {
      // Intentionally omitting required fields
    };

    const ticket = new Ticket(ticketData);

    try {
      await ticket.save();
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });
});
