import Group from "../models/Group.js";

// get create group requests placeholder
export const getCreateGroupRequests = async (req, res) => {
  try {
    const createGroupRequests = await Group.find({ status: "pending" });
    const updatedGroups = createGroupRequests.map(group => {
      const requestedByUser = user.name;
      return { ...group._doc, requested_by: requestedByUser };
    });
    res.send({ message: "succss", grous: updatedGroups });
  } catch (error) {
    res.status(500).send({ ErrorMessage: "Failed to get create group requests", error });
  }
};
