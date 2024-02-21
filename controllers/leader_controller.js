import Group from "../models/Group.js";
import User from "../models/User.js";

// get create group requests placeholder
export const getCreateGroupRequests = async (req, res) => {
  try {
    const createGroupRequests = await Group.find({ status: "pending" });
    const userId = req.user.userId;
    const user = await User.findById(userId);
    const updatedGroups = createGroupRequests.map((group) => {
      const requestedByUser = user.name;
      return { ...group._doc, requested_by: requestedByUser };
    });
    res.send({ message: "succss", grous: updatedGroups });
  } catch (error) {
    res
      .status(500)
      .send({ ErrorMessage: "Failed to get create group requests", error });
  }
};
