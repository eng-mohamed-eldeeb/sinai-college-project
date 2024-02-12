import User from "../models/User.js";
import Group from "../models/Group.js";


export const deleteAllGroups = async (req, res) => {
  try {
    await Group.deleteMany();
    res.send({ message: "All groups deleted" });
  } catch (error) {
    res.status(500).send({ message: "Failed to delete groups", error });
  }
}

export const getUserGroups = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    
    const groups = await Group.find({ members: userId, status: "accepted"});
    // sot the groups so that the groups in the user's stared_groups array come first
    groups.sort((a, b) => {
      if (user.stared_groups.includes(a._id)) {
        return -1;
      } else if (user.stared_groups.includes(b._id)) {
        return 1;
      }
      return 0;
    });
    
    if (groups.length === 0) {
      return res.status(404).send({ message: "User has no groups" });
    }
    
    res.send({message: "get user groups", groups, user: user.name});
  } catch (error) {
    res.status(500).send({ message: "Failed to get user groups", error });
  }
};

export const getGroups = async (req, res) => {
  try {
        const userId = req.user.userId;
        const groups = await Group.find({ status: "accepted", members: { $ne: userId } });
        res.status(200).send(groups);
    } catch (err) {
        res.status(500).send('Error retrieving groups');
    }
};

export const joinGroup = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    const groupId = req.params.id;
    const group = await Group.findById(groupId); // Convert groupId to ObjectId
    if (!group) {
      return res.status(404).send({ message: "Group not found" });
    }
    if (group.members.includes(userId)) {
      return res.status(400).send({ message: "You are already a member of this group" });
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
    res.status(500).send({ message: "Failed to join group", error });
  }
}

export const createGroup = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    const { subject_name, subject_group, description, majore } = req.body;
    const group = new Group({
      subject_name,
      subject_group,
      description,
      majore,
      requested_by: [userId]
    });
    await group.save();
    
    res.send({ message: "create group requested", group: {
      subject_name,
      subject_group,
      description,
      majore,
      requested_by: user.name
    } });

  } catch (error) {
      res.status(500).send({ message: "Failed to create group", error });
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
    res.status(500).send({ message: "Failed to change group status", error });
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
        res.status(500).send({ message: "Failed to delete group", error });
      }
    } else {
      res.status(403).send({ message: "You are not authorized to delete this group" });
    }
  } catch (error) {
    res.status(500).send({ message: "Failed to delete group", error });
  }
};

export const changeStatuse = async (req, res) => {
  try {
    const groupId = req.params.id;
    const status = req.body.status;
    const user = await User.findById(req.user.userId);
    if (user.role == "user") {
      return res.status(403).send({ message: "You are not authorized to change group status" });
    }
    const group = await Group.findByIdAndUpdate(groupId, { status }, { new: true });
    
    if (!group) {
      return res.status(404).send({ message: "Group not found" });
    }
    res.send({ message: "success" });
  } catch (error) {
    res.status(500).send({ message: "Failed to change group status", error });
  }
}
