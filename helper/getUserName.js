import User from "../models/User.js";

export default async (id) => {
  const user = await User.findById(id);
  if (user) {
    return user.name;
  } else {
    return "deleted user";
  }
};
