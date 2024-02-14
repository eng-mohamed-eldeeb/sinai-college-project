import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  phoneNumber: String,
  group: String,
  role: {
    type: String,
    enum: ["leader", "user", "admin"],
    default: "leader",
  },
  has_paid: {
    type: Boolean,
    default: false,
  },
  package_type: {
    type: String,
    enum: ["basic", "intertainment", "hold"],
    default: "hold",
  },
  stared_groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
  ],
  number_of_login: {
    type: Number,
    default: 0,
  },
});

userSchema.methods.getName = function () {
  return this.name;
};

userSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};



const User = mongoose.model("User", userSchema);

export default User;
