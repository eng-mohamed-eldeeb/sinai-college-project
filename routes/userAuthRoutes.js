import auth from "../middleware/authentication.js";
import express from "express";
const router = express.Router();

import {
  login,
  register,
  deleteAllUsers,
  starGroup,
  deleteUser,
  logout,
  resetPassword,
  getRoleAndExpiration,
  checkLogin,
} from "../controllers/user_controller.js";

// create the user
router
  .post("/", register)
  .post("/login", login)
  .post("/groups/:id/starGroup", auth, starGroup)
  .post("/checkLogin", checkLogin);
router
  .delete("/deleteAllUsers", deleteAllUsers)
  .delete("/deleteUser", auth, deleteUser)
  .delete("/logout", auth, logout);
router.put("/resetPassword", auth, resetPassword);
router
  .get("/getRoleAndExpiration", auth, getRoleAndExpiration)
  .get("/checkLogin", checkLogin);

export default router;
