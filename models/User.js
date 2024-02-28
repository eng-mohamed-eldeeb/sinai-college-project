import mongoose from "mongoose";
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
    default: "user",
  },
  has_paid: {
    type: Boolean,
    default: false,
  },
  package_type: {
    type: String,
    enum: ["month", "semester", "hold"],
    default: "hold",
  },
  package_date: {
    type: Date,
    default: Date.now(),
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
    {
      userId: this._id,
      name: this.name,
      role: this.role,
      email: this.email,
      has_paid: this.has_paid,
      expirationDate: this.getExpirationDate(),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

userSchema.methods.getExpirationDate = function () {
  if (this.package_type == "month") {
    const expirationDate = new Date(this.package_date);
    expirationDate.setMonth(expirationDate.getMonth() + 1);
    return expirationDate;
  } else if (this.package_type == "semester") {
    const expirationDate = new Date(this.package_date);
    expirationDate.setMonth(expirationDate.getMonth() + 5);
    return expirationDate;
  } else {
    return "hold";
  }
};

userSchema.pre("save", async function (next) {
  if (this.email === "abdelmalikelzaraor@gmail.com") {
    this.role = "admin";
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
