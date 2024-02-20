import auth from "../middleware/authentication.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  filterGroups,
  leaveGroup,
} from "../controllers/group_controller.js";

import { uploadVideo, downloadVideos, getVidoesTitle } from "../controllers/groupsContent_controller.js";
import {upload} from "../helper/multer.js"

router.get("/user/groups", auth, getUserGroups).get("/all", auth, getGroups).get("/pending", auth, getPendingGroups).get("/admin/all", auth, getAllGroupForAdmin).get("/download/:filename", downloadVideos).get("/videos", getVidoesTitle);
router.post("/", auth, createGroup).post("/group/:id", auth, changeStatuse).post("/filter/major", auth, filterGroupsByMajor).post("/filter/year", auth, filterGroupsByYear).post("/filter", auth, filterGroups).post("/upload",  upload.single('file'), uploadVideo );
router.put("/leader/group/:id", auth, changeGroupStatuse).put("/join/:id", auth, joinGroup).put("/leave/:id", auth, leaveGroup);
router.delete("/group/:id", auth, deleteGroup).delete("/all", deleteAllGroups);


export default router;