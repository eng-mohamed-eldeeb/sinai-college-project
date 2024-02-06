import User from "../models/User.js";
import StatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader || tokenHeader.startsWith("Bearer "))
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Token not found" });
  const token = tokenHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId };
    next();
  } catch (err) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Invalid token" });
  }
};

export default auth;
