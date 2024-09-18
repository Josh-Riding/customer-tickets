import mongoose from "mongoose";
import bcrypt from "bcrypt";

export const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  userEmail: {
    type: String,
    required: true,
    unique: true,
  },
  userPassword: {
    type: String,
    required: true,
    unique: true,
  },
  creationDate: {
    type: Number,
    required: true,
  },
});

//Hash the password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("userPassword")) {
    this.userPassword = await bcrypt.hash(this.userPassword, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.userPassword);
};

const User = mongoose.model("User", userSchema);
export default User;
