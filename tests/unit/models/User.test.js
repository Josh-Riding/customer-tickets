import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../../src/models/User"; // Adjust the import path as necessary
import bcrypt from "bcrypt";

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

describe("User Model Test", () => {
  it("should create a new user and compare passwords", async () => {
    const userName = "testuser";
    const userEmail = "test@example.com";
    const userPassword = "password123";

    // Create a new user
    const user = new User({
      userName,
      userEmail,
      userPassword,
      creationDate: Date.now(),
    });

    // Save the user to the database
    await user.save();

    // Check that the user is saved correctly
    const savedUser = await User.findOne({ userEmail });
    expect(savedUser).not.toBeNull();
    expect(savedUser.userName).toBe(userName);
    expect(savedUser.userEmail).toBe(userEmail);

    // Compare passwords
    const isMatch = await savedUser.comparePassword(userPassword);
    expect(isMatch).toBe(true);

    // Ensure that the password is hashed
    const isPasswordHashed = await bcrypt.compare(
      userPassword,
      savedUser.userPassword
    );
    expect(isPasswordHashed).toBe(true);
  });
});
