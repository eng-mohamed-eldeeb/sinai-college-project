import { StatusCodes } from "http-status-codes";
import Group from "../models/Group.js";
import User from "../models/User.js";


// delete all users
export const deleteAllUsers = async (req, res) => {
  await User.deleteMany({});
  res.status(StatusCodes.OK).send({message: "All users deleted"});
};


// login controller placeholder
export const login = async (req, res) => {
  try {

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
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ErrorMessage: "Server error"});
  }
};

// register controller placeholder
export const register = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    if (!name || !email || !password || !phoneNumber) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({"error": "Please provide name, email and password"});
    }
    try{
      const user = await User.create({...req.body});
      // later I will send a confirmation email
      res.status(StatusCodes.CREATED).send({success: "User created", user});
    } catch (error) {
      if (error.code === 11000) {
        return res.status(StatusCodes.BAD_REQUEST).send({ErrorMessage: "Email already exists"});
      }
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ErrorMessage: "Server error"});
  }
};

// star a group
export const starGroup = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    const groupId = req.params.id;
    if (!await Group.findById(groupId)) {
      return res.status(StatusCodes.NOT_FOUND).send({ message: "Group not found" });
    }

    if (user.stared_groups.includes(groupId)) {
      user.stared_groups.pop(groupId);
    } else {
      user.stared_groups.push(groupId);
    }
    await user.save();
    res.status(StatusCodes.OK).send({ message: "success", user });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ErrorMessage: "Server error"});
    }
  }

export default {
  login,
  register,
};
