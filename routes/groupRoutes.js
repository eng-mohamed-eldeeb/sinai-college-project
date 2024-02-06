import auth from "../middleware/authentication.js";
// groupRoutes.js

import express from "express";
const router = express.Router();

import {
  getUserGroups,
  getGroups,
  createGroup,
  updateGroup,
  deleteGroup,
} from "../controllers/group_controller.js";

router.get("/user/groups", auth, getUserGroups).get("/all", getGroups);
router.post("/", auth, createGroup);
router.put("/", auth, updateGroup);
router.delete("/", auth, deleteGroup);

export default router;
