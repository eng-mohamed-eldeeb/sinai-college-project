import User from "../models/User.js";
import StatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const tokenHeader = req.headers.authorization;
    if (!tokenHeader || tokenHeader.startsWith("Bearer "))
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Token not found" });
    const token = tokenHeader.split(" ")[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { userId: payload.userId };
      // check if user has paid
      const user = await User.findById(req.user.userId);
      if (user.role !== "admin") {
        if (
          user.getExpirationDate > new Date() ||
          user.package_type == "hold"
        ) {
          return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ ErrorMessage: "User has not paid" });
        }
      }
      next();
    } catch (err) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid token" });
    }
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error });
  }
};

export default auth;
