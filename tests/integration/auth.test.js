// auth.test.js
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import dotenv from "dotenv";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file located in src directory
dotenv.config({ path: resolve(__dirname, "../../src/.env") });
import request from "supertest";
import express from "express";
import authRoutes from "../../src/routes/auth.js";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../src/models/User.js";

let mongoServer;
let connection;

const app = express();
app.use(express.json()); // Handle JSON data
app.use(authRoutes); // Use the auth routes for this test instance

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  connection = await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe("POST /register", () => {
  it("should return a 400 status and an error message when user data is not provided", async () => {
    const response = await request(app).post("/register").send({});

    expect(response.statusCode).toBe(400); // Ensure the correct status code
    expect(response.body).toEqual({
      message: "User not registered successfully.",
    });
  }, 10000);
});

it("should return a 201 status and an message when user data is provided", async () => {
  const userName = "testuser";
  const userEmail = "test@example.com";
  const userPassword = "password123";
  const response = await request(app).post("/register").send({
    userName: userName,
    userEmail: userEmail,
    userPassword: userPassword,
  });

  expect(response.statusCode).toBe(201);
  expect(response.body).toEqual({ message: "User registered successfully" });
});

describe("POST /login", () => {
  beforeEach(async () => {
    // Insert a test user before each login test
    const testUser = new User({
      userName: "testuser",
      userEmail: "test@example.com",
      userPassword: "password123",
      creationDate: "123456",
    });
    // Save the test user to the database (hash password before saving)
    await testUser.save();
  });

  it("should return a 400 status and an error message for incorrect password", async () => {
    const response = await request(app)
      .post("/login")
      .send({ userName: "testuser", userPassword: "wrongpassword" });

    expect(response.statusCode).toBe(400); // Ensure the correct status code for invalid credentials
    expect(response.body).toEqual({
      error: "Invalid Credentials",
    });
  });

  it("should return a 400 status and an error message for non-existent user", async () => {
    const response = await request(app)
      .post("/login")
      .send({ userName: "nonexistentuser", userPassword: "password123" });

    expect(response.statusCode).toBe(400); // Ensure the correct status code for invalid credentials
    expect(response.body).toEqual({
      error: "Invalid Credentials",
    });
  });

  it("should return a 200 status and a token for correct credentials", async () => {
    const response = await request(app)
      .post("/login")
      .send({ userName: "testuser", userPassword: "password123" });

    expect(response.statusCode).toBe(200); // Ensure the correct status code for valid credentials
    expect(response.body).toHaveProperty("token"); // Ensure a token is returned
  });
});
