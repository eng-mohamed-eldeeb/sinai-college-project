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
  .get("/data", auth, getDataTitle)
  .get("/thumbnail", auth, getTumbnail);
router.post("/upload", auth, upload.single("file"), uploadData);

export default router;
