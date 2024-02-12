import auth from "../middleware/authentication.js";
// groupRoutes.js

import express from "express";
const router = express.Router();

import {
  getUserGroups,
  getGroups,
  createGroup,
  changeGroupStatuse,
  deleteAllGroups,
  joinGroup,
  deleteGroup,
  changeStatuse,
  getPendingGroups,
} from "../controllers/group_controller.js";

router.get("/user/groups", auth, getUserGroups).get("/all", auth, getGroups).get("/pending", auth, getPendingGroups);
router.post("/", auth, createGroup).post("/group/:id", auth, changeStatuse);
router.put("/leader/group/:id", auth, changeGroupStatuse).put("/join/:id", auth, joinGroup)
router.delete("/group/:id", auth, deleteGroup).delete("/all", deleteAllGroups);

export default router;
