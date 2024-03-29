import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  subject_name: {
    type: String,
    required: [true, "Please provide a name"],
    maxlength: 100,
  },
  subject_group: {
    type: String,
    required: [true, "Please provide a group"],
    maxlength: 40,
  },
  year: {
    type: String,
    required: [true, "Please provide a year"],
    maxlength: 4,
    default: "1",
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
    minlength: 20,
    maxlength: 1000,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  requested_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  majore: {
    type: String,
    enum: [
      "dentist",
      "pharmacy",
      "physical therapy",
      "engineering",
      "computer science",
      "business",
      "media",
      "other",
    ],
    default: "dentist",
  },
});

// add the user how requested to join the group
groupSchema.pre("save", async function (next) {
  const user = await this.model("User").findById(this.requested_by);
  this.members.push(user._id);
  await user.save();
  next();
});

groupSchema.index({ subject_name: 1, subject_group: 1 }, { unique: true });

const Group = mongoose.model("Group", groupSchema);

export default Group;
