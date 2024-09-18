import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import dotenv from "dotenv";

dotenv.config();

let mongoServer;

// Setup an in-memory MongoDB server
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
});

// Teardown after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Test suite
describe("Database Connection", () => {
  it("should connect to the database", async () => {
    const db = mongoose.connection.db;
    const admin = db.admin();
    const result = await admin.listDatabases();

    // Ensure at least one database exists
    expect(result.databases.length).toBeGreaterThan(0);
  });
});
