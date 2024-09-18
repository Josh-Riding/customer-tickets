import { jest } from "@jest/globals";
import mongoose from "mongoose";
import Ticket from "../../../src/models/Ticket";
import { assignTicket } from "../../../src/services/ticketService";
import {
  createTicket,
  usersTickets,
  modifyTicket,
  deleteTicket,
  assignTicketToUser,
} from "../../../src/controllers/ticketController";

const mockRequest = (body = {}, params = {}, query = {}) => ({
  body,
  params,
  query,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res._getData = jest.fn().mockReturnValue(res.body);
  return res;
};

const mockNext = jest.fn(); // Mock the next function

describe("Ticket Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createTicket", () => {
    it("should create a ticket and return a success message", async () => {
      const req = mockRequest({
        body: {
          ticketSubject: "Test Subject",
          ticketDescription: "Test Description",
          ticketCreatorId: mongoose.Types.ObjectId(),
          ticketCompleted: false,
          ticketAssignedId: [mongoose.Types.ObjectId()],
        },
      });

      const res = mockResponse();

      Ticket.prototype.save = jest.fn().mockResolvedValue(req.body);

      await createTicket(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Ticket created successfully",
      });
    });
  });
});
