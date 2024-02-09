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
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.getName = function () {
  return this.username;
};

userSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

userSchema.methods.comparePasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
