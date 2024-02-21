import User from "../models/User.js";

// get all users
export const getUsers = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role != "admin") {
      return res
        .status(403)
        .send({ ErrorMessage: "You are not authorized to delete user" });
    }
    const users = await User.find().sort({
      package_type: 1,
      expirationDate: 1,
    });

    const usersWithExpirationDate = users.map((user) => {
      const expirationDate = user.getExpirationDate(); // Assuming the User model has a method called getExpirationDate()
      return { ...user.toObject(), expirationDate };
    });

    res.status(200).send(usersWithExpirationDate);
  } catch (error) {
    res.status(500).send({ ErrorMessage: "Failed to get users", error });
  }
};

// search for user by name
export const searchUserByName = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role != "admin") {
      return res
        .status(403)
        .send({ ErrorMessage: "You are not authorized to delete user" });
    }
    const name = req.body.name;
    const users = await User.find({ name: { $regex: name, $options: "i" } });
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ ErrorMessage: "Failed to search for user", error });
  }
};

// update user role
export const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role != "admin") {
      return res
        .status(403)
        .send({ ErrorMessage: "You are not authorized to delete user" });
    }
    const userId = req.params.id;
    const role = req.body.role;
    const updateduser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );
    if (!updateduser) {
      return res.status(404).send({ ErrorMessage: "User not found" });
    }
    res.send({ message: "success" });
  } catch (error) {
    res.status(500).send({ ErrorMessage: "Failed to update user role", error });
  }
};

// delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role != "admin") {
      return res
        .status(403)
        .send({ ErrorMessage: "You are not authorized to delete user" });
    }
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).send({ ErrorMessage: "User not found" });
    }
    res.send({ message: "user deleted" });
  } catch (error) {
    res.status(500).send({ ErrorMessage: "Failed to delete user", error });
  }
};

// update user package type
export const updateUserPackageType = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role != "admin") {
      return res
        .status(403)
        .send({ ErrorMessage: "You are not authorized to delete user" });
    }
    const userId = req.params.id;
    const package_type = req.body.package_type;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { package_type },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).send({ ErrorMessage: "User not found" });
    }
    res.send({ message: "success" });
  } catch (error) {
    res
      .status(500)
      .send({ ErrorMessage: "Failed to update user package type", error });
  }
};
