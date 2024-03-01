import User from "../models/User.js";
export const updateRequestedBy = async (groups) => {
  const updatedGroups = await Promise.all(
    groups.map(async (group) => {
      const user = await User.findById(group.requested_by);
      const requestedByUser = user ? user.name : "abd el malik zarzor";
      return { ...group._doc, requested_by: requestedByUser };
    })
  );
  return updatedGroups;
};
