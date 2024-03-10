import { StatusCodes } from "http-status-codes";
import Group from "../models/Group.js";
import User from "../models/User.js";

// delete all users
export const deleteAllUsers = async (req, res) => {
  await User.deleteMany({});
  res.status(StatusCodes.OK).send({ message: "All users deleted" });
};

// login controller placeholder
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ ErrorMessage: "Please provide email and password" });
    }
    if (req.body.device_id === undefined) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ ErrorMessage: "Please provide device_id" });
    }
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ ErrorMessage: "Invalid credentials" });
    }
    if (user.password !== password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ ErrorMessage: "Invalid credentials" });
    }
    user.device_id = req.body.device_id;
    user.logged_in = true;
    await user.save();
    const token = user.createJWT();
    res
      .status(StatusCodes.OK)
      .send({ message: "Logged in", token: "Barear " + token });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ ErrorMessage: "Server error" });
  }
};

// register controller placeholder
export const register = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    if (!name || !email || !password || !phoneNumber) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: "Please provide name, email and password" });
    }
    try {
      const user = await User.create({ ...req.body });
      // later I will send a confirmation email
      res.status(StatusCodes.CREATED).send({
        success: "User created",
        user: { ...user._doc, password: "*****" },
      });
    } catch (error) {
      if (error.code === 11000) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send({ ErrorMessage: "Email already exists" });
      }
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ ErrorMessage: "Server error" });
  }
};

// logout
export const logout = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ ErrorMessage: "User not found" });
    }
    user.device_id = "none";
    await user.save();
    res.status(StatusCodes.OK).send({ message: "Logged out" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ ErrorMessage: "Server error" }, error);
  }
};

// star a group
export const starGroup = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    const groupId = req.params.id;
    if (!(await Group.findById(groupId))) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ ErrorMessage: "Group not found" });
    }

    if (user.stared_groups.includes(groupId)) {
      user.stared_groups.pop(groupId);
    } else {
      user.stared_groups.push(groupId);
    }
    await user.save();
    res
      .status(StatusCodes.OK)
      .send({ message: "success", user: { ...user._doc, password: "*****" } });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ ErrorMessage: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ ErrorMessage: "User not found" });
    }
    await User.findByIdAndDelete(userId);
    res.status(StatusCodes.OK).send({ message: "User deleted" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ ErrorMessage: "Server error" });
  }
};

export default {
  login,
  register,
};

// reset password
export const resetPassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ ErrorMessage: "User not found" });
    }
    if (req.body.current_password !== user.password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ ErrorMessage: "Invalid password" });
    }
    user.password = req.body.new_password;
    await user.save();
    res.status(StatusCodes.OK).send({ message: "Password reset" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ ErrorMessage: "Server error" });
  }
};

// get role and expiration date
export const getRoleAndExpiration = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ ErrorMessage: "User not found" });
    }
    res.status(StatusCodes.OK).send({
      message: "success",
      role: user.role,
      package_type: user.package_type,
      expiration_date: user.getExpirationDate(),
    });
  } catch {}
};

// check login
export const checkLogin = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ ErrorMessage: "User not found" });
    }
    if (user.device_id === "none" || user.role === "admin") {
      return res.status(StatusCodes.OK).send({ is_logged: false });
    } else {
      return res.status(StatusCodes.OK).send({ is_logged: true });
    }
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ ErrorMessage: "Server error" });
  }
};
