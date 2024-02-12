import auth from "../middleware/authentication.js";
import express from "express";

const router = express.Router();

import {
  getCreateGroupRequests,
  responseCreateGroupRequests,
  login,
  logout,
} from "../controllers/leader_controller.js";

router.get("/leaders/", auth, getCreateGroupRequests);
router.post("/leaders/group", responseCreateGroupRequests).post("/login", login);
router.delete("/leaders/logout", logout);

export default router;