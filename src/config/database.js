//create a database connection to use
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const db_uri = process.env.DB_URI;

mongoose
  .connect(db_uri)
  .then(() => console.log("Connected to MongoDB with Mongoose"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

export default mongoose;
