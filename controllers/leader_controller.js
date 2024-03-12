import Group from "../models/Group.js";
import User from "../models/User.js";

// get create group requests placeholder
export const getCreateGroupRequests = async (req, res) => {
  try {
    const createGroupRequests = await Group.find({ status: "pending" });
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ ErrorMessage: "User not found" });
    }
    const updatedGroups = await Promise.all(
      createGroupRequests.map(async (group) => {
        var requestedByUser = await User.findById(group.requested_by);
        return { ...group._doc, requested_by: requestedByUser.name };
      })
    );
    res.send({ message: "success", groups: updatedGroups });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ ErrorMessage: "Failed to get create group requests", error });
  }
};
