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
        enum: ["dentist", "pharmacy", "physical therapy", "engineering", "Computer Science", "Business", "media", "other"],
        default: "dentist",
    },
    star: {
        type: Boolean,
        default: false,
    }
});

groupSchema.index({ subject_name: 1, subject_group: 1}, { unique: true });

const Group = mongoose.model("Group", groupSchema);

export default Group;