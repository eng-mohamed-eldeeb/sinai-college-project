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
      const user = await User.findById(req.user.userId);
      if (req.url !== "/delete_user") {
        if (req.url !== "/logout") {
          if (user.role !== "admin") {
            if (user.package_type === "hold") {
              if (user.package_date < new Date()) {
                return res
                  .status(StatusCodes.UNAUTHORIZED)
                  .json({ ErrorMessage: "Package expired" });
              }
            }
          }
        }
      }
      console.log(user.device_id !== payload.device_id);
      if (user.role !== "admin") {
        if (req.url !== "/logout") {
          if (user.device_id !== payload.device_id) {
            return res
              .status(StatusCodes.UNAUTHORIZED)
              .json({ ErrorMessage: "This email is used in another device" });
          }
        }
      }
      next();
    } catch (err) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ ErrorMessage: "Invalid token" });
    }
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ ErrorMessage: error });
  }
};

export default auth;
