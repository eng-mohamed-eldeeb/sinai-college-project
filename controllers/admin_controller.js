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
    const users = await User.find({ _id: { $ne: req.user.userId } }).sort({
      expirationDate: 1,
      package_type: 1,
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
    const users = await User.find({
      name: { $regex: name, $options: "i" },
      _id: { $ne: req.user.userId },
    });
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
      { package_type, package_date: Date.now() },
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

// get the revenue
export const getRevenue = async (req, res) => {
  try {
    let user = await User.findById(req.user.userId);
    if (user.role != "admin") {
      return res
        .status(403)
        .send({ ErrorMessage: "You are not authorized to delete user" });
    }
    let users = await User.find({});
    let new_semster_student = 0;
    let old_semester_student = 0;
    let monthely_student = 0;
    let revenue = 0;

    users.forEach((user) => {
      if (user.package_type == "semester") {
        let date_now = new Date();
        date_now.setMonth(date_now.getMonth() + 1);
        if (user.package_date < date_now) {
          new_semster_student += 1;
          revenue += 100;
        } else {
          old_semester_student += 1;
        }
      } else if (user.package_type == "month") {
        monthely_student += 1;
        revenue += 30;
      }
    });
    const development_revenue = (revenue / 5) * 3;
    const mangment_revenue = (revenue / 5) * 2;
    res.status(200).send({
      new_semster_student,
      old_semester_student,
      monthely_student,
      total_revenue: revenue,
      development_revenue,
      mangment_revenue,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ ErrorMessage: "Failed to get revenue", error });
  }
};
