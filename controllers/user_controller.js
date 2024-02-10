import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";


// delete all users
export const deleteAllUsers = async (req, res) => {
  await User.deleteMany({});
  res.status(StatusCodes.OK).send({message: "All users deleted"});
};


// login controller placeholder
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ErrorMessage: "Please provide email and password"});
  }
  const user = await User.findOne({
    email,
  });
  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).send({ErrorMessage: "Invalid credentials"});
  }
  const isMatch = await user.comparePasswords(password);
  if (!isMatch) {
    return res.status(StatusCodes.BAD_REQUEST).send({ErrorMessage: "Invalid credentials"});
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).send({message: "Logged in", token: "Barear " + token});
};

// register controller placeholder
export const register = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  if (!name || !email || !password || !phoneNumber) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({"error": "Please provide name, email and password"});
  }
  try{
    const user = await User.create({...req.body});
    console.log(user);
    // later I will send a confirmation email
    res.status(StatusCodes.CREATED).send({success: "User created", user});
  } catch (error) {
    if (error.code === 11000) {
      return res.status(StatusCodes.BAD_REQUEST).send({ErrorMessage: "Email already exists"});
    }
  }
};

export default {
  login,
  register,
};
