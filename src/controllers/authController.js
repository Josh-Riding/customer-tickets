import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { userName, userPassword, userEmail } = req.body;

    //check if user exists
    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User email already exists" });
    }
    const user = new User({
      userName,
      userPassword,
      userEmail,
      creationDate: Date.now(),
    });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ message: "User not registered successfully." });
  }
};

export const login = async (req, res) => {
  try {
    const { userName, userPassword } = req.body;
    const user = await User.findOne({ userName });
    if (!user || !(await user.comparePassword(userPassword))) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};
