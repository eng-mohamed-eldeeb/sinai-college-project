import auth from "../middleware/authentication.js";
import {
  uploadData,
  downloadData,
  getDataTitle,
  getTumbnail,
} from "../controllers/groupsContent_controller.js";
import { upload } from "../helper/multer.js";
import express from "express";
const router = express.Router();

router
  .get("/download/:filename", auth, downloadData)
  .get("/thumbnail", auth, getTumbnail);
router
  .post("/upload", auth, upload.single("file"), uploadData)
  .post("/data", auth, getDataTitle);
router
  .patch("/download/:filename", auth, downloadData)
  .patch("/data", auth, getDataTitle);

export default router;
