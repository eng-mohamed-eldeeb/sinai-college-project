import User from "../models/User.js";
// group_controller.js

export const getUserGroups = async (req, res) => {
  const userId = req.user.userId;
  const user = await User.findById(userId);
  res.send({message: "get user groups", user});
};

export const getGroups = (req, res) => {
  res.send("get groups");
};

export const createGroup = (req, res) => {
  res.send("create group");
};

export const updateGroup = (req, res) => {
  res.send("update group");
};

export const deleteGroup = (req, res) => {
  res.send("delete group");
};
