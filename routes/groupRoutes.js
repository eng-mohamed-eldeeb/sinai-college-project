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
  getAllGroupForAdmin,
  filterGroupsByMajor,
  filterGroupsByYear,
  filterGroups
} from "../controllers/group_controller.js";

router.get("/user/groups", auth, getUserGroups).get("/all", auth, getGroups).get("/pending", auth, getPendingGroups).get("/admin/all", auth, getAllGroupForAdmin);
router.post("/", auth, createGroup).post("/group/:id", auth, changeStatuse).post("/filter/major", auth, filterGroupsByMajor).post("/filter/year", auth, filterGroupsByYear).post("/filter", auth, filterGroups);
router.put("/leader/group/:id", auth, changeGroupStatuse).put("/join/:id", auth, joinGroup)
router.delete("/group/:id", auth, deleteGroup).delete("/all", deleteAllGroups);

export default router;
