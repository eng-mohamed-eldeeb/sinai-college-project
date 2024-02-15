import User from "../models/User.js";
import Group from "../models/Group.js";
import {filterMajore} from "../helper/filterGroups.js"


export const deleteAllGroups = async (req, res) => {
  try {
    await Group.deleteMany();
    res.send({ message: "All groups deleted" });
  } catch (error) {
    res.status(500).send({ ErrorMessage: "Failed to delete groups", error });
  }
}

export const getUserGroups = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    const groups = await Group.find({ members: userId, status: "accepted" });

    // Replace requested_by with user.name
    const updatedGroups = groups.map(group => {
      const requestedByUser = user.name;
      return { ...group._doc, requested_by: requestedByUser };
    });

    // Sort the groups so that the groups in the user's stared_groups array come first
    updatedGroups.sort((a, b) => {
      if (user.stared_groups.includes(a._id)) {
        return -1;
      } else if (user.stared_groups.includes(b._id)) {
        return 1;
      }
      return 0;
    });

    if (updatedGroups.length === 0) {
      return res.status(404).send({ ErrorMessage: "User has no groups" });
    }

    res.send({ message: "get user groups", groups: updatedGroups, number_of_liked_groups: user.stared_groups.length });
  } catch (error) {
    res.status(500).send({ ErrorMessage: "Failed to get user groups", error });
  }
};

export const getGroups = async (req, res) => {
  try {
        const userId = req.user.userId;
        const groups = await Group.find({ status: "accepted", members: { $ne: userId } });
        res.status(200).send(groups);
    } catch (err) {
        res.status(500).send({ErrorMessage: 'Error retrieving groups'});
    }
};

export const joinGroup = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ ErrorMessage: "User not found" });
    }
    const groupId = req.params.id;
    const group = await Group.findById(groupId); // Convert groupId to ObjectId
    if (!group) {
      return res.status(404).send({ ErrorMessage: "Group not found" });
    }
    if (group.members.includes(userId)) {
      return res.status(400).send({ ErrorMessage: "You are already a member of this group" });
    }
    group.members.push(userId);
    await group.save();
    res.send({ message: "join group requested", group: {
      subject_name: group.subject_name,
      subject_group: group.subject_group,
      description: group.description,
      majore: group.majore,
      requested_by: user.name
    } });
  } catch (error) {
    res.status(500).send({ ErrorMessage: "Failed to join group", error });
  }
}

export const createGroup = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    const { subject_name, subject_group, description, majore, year } = req.body;
    console.log(req.body);
    const group = new Group({
      subject_name,
      year,
      subject_group,
      description,
      majore,
      requested_by: [userId]
    });
    await group.save();
    console.log(group);
    res.send({ message: "create group requested", group: {
      subject_name,
      subject_group,
      description,
      majore,
      year,
      requested_by: user.name
    } });

  } catch (error) {
      res.status(500).send({ ErrorMessage: "Failed to create group", error });
  }
};

export const changeGroupStatuse = async (req, res) => {
  try {
    const groupId = req.params.id;
    const status = req.body.status;
    if (status === "rejected") {
      Group.findByIdAndDelete(groupId);
      res.send({ message: "group rejected" });
    }
    await Group.findByIdAndUpdate(groupId, { status }, { new: true });
    res.send({ message: "group accepted" });
  } catch (error) {
    res.status(500).send({ ErrorMessage: "Failed to change group status", error });
  }
};

export const deleteGroup = async (req, res) => {
  try{
    const group = await Group.findById(req.params.id);
    const userId = req.user.userId;
    const user = await User.findById(userId);
  
    if (group.requested_by.toHexString() == userId || user.role == "leader") {
      try {
        await Group.findByIdAndDelete(req.params.id);
        res.send({ message: "group deleted" });
      } catch (error) {
        res.status(500).send({ ErrorMessage: "Failed to delete group", error });
      }
    } else {
      res.status(403).send({ ErrorMessage: "You are not authorized to delete this group" });
    }
  } catch (error) {
    res.status(500).send({ ErrorMessage: "Failed to delete group", error });
  }
};

export const changeStatuse = async (req, res) => {
  try {
    const groupId = req.params.id;
    const status = req.body.status;
    const user = await User.findById(req.user.userId);
    if (user.role == "user") {
      return res.status(403).send({ ErrorMessage: "You are not authorized to change group status" });
    }
    const group = await Group.findByIdAndUpdate(groupId, { status }, { new: true });
    
    if (!group) {
      return res.status(404).send({ ErrorMessage: "Group not found" });
    }
    res.send({ message: "success" });
  } catch (error) {
    res.status(500).send({ ErrorMessage: "Failed to change group status", error });
  }
}

// retuen the number of pending groups
export const getPendingGroups = async (req, res) => {
  try {
    const groups = await Group.find({ status: "pending" });
    const userId = req.user.userId;
    if (User.findById(userId).role == "user") {
      return res.status(403).send({ ErrorMessage: "You are not authorized to get pending groups" });
    }
    res.send({ message: "get pending groups", groups: groups.length });
  } catch (error) {
    res.status(500).send({ ErrorMessage: "Failed to get pending groups", error });
  }
}

export const getAllGroupForAdmin = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (User.findById(userId).role == "user") {
      return res.status(403).send({ ErrorMessage: "You are not authorized to get all groups" });
    } else {
      const groups = await Group.find();
      res.send({ message: "get all groups", groups });
    }
  } catch (error) {
    res.status(500).send({ ErrorMessage: "Failed to get all groups", error });
  }
}

// groups filtering
// get the year's by major
export const filterGroupsByMajor = async (req, res) => {
  try { 
    res.send({ message: "get groups", grades: filterMajore(req.body.majore) });
  } catch (error) {
    res.status(500).send({ ErrorMessage: "Failed to filter groups", error });
  }
}

// get the subject groups by major and year
export const filterGroupsByYear = async (req, res) => {
  try {
    const groups = await Group.find({ majore: req.body.majore, year: req.body.year });
    // get the subjects only
    const subjectsSet = new Set(groups.map(group => group.subject_name));
    const subjects = Array.from(subjectsSet);
    res.send({ message: "get groups", subjects });
  } catch (error) {
    res.status(500).send({ ErrorMessage: "Failed to filter groups", error });
  }
}

// get filtered groups
export const filterGroups = async (req, res) => {
  try {
    const groups = await Group.find(req.body);
    res.send({ message: "get groups", groups });
  } catch (error) {
    res.status(500).send({ ErrorMessage: "Failed to filter groups", error });
  }
}

// leave group
export const leaveGroup = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ ErrorMessage: "User not found" });
    }

    const groupId = req.params.id;

    // Check if the group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).send({ ErrorMessage: "Group not found" });
    }

    // Check if the user is a member of the group
    if (!group.members.includes(userId)) {
      return res.status(400).send({ ErrorMessage: "You are not a member of this group" });
    }

    // Filter out the user from the group.members array
    group.members = group.members.filter(memberId => memberId.toString() !== userId.toString());

    // Save the changes to the database
    await group.save();

    res.send({ message: "Successfully left the group" });
  } catch (error) {
    res.status(500).send({ ErrorMessage: "Failed to leave group", error });
  }
};
