import Group from "../models/Group.js";

// get create group requests placeholder
export const getCreateGroupRequests = async (req, res) => {
  try {
    const createGroupRequests = await Group.find({ status: "pending" });
    res.send({ message: "succss", grous: createGroupRequests });
  } catch (error) {
    res.status(500).send({ message: "Failed to get create group requests", error });
  }
};

// approve create group requests placeholder
export const responseCreateGroupRequests = (req, res) => {
  res.send("approve or decline create group");
};



// login placeholder
export const login = (req, res) => {
  res.send("login");
};

// logout placeholder
export const logout = (req, res) => {
  res.send("logout");
};
