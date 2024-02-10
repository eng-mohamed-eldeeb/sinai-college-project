import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        minlength: 3,
        maxlength: 100,
    },
    description: {
        type: String,
        required: [true, "Please provide a description"],
        minlength: 3,
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
    request: {
        type: string,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
    majore: {
        type: String,
        enum: ["dentist", "pharmacy", "physical therapy", "engineering", "Computer Science", "Business", "media", "other"],
        default: "hold",
    },
    });

const Group = mongoose.model("Group", groupSchema);

export default Group;