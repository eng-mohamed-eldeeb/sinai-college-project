import auth from "../middleware/authentication.js";
import {
  uploadVideo,
  downloadVideos,
  getVidoesTitle,
  getTumbnail,
} from "../controllers/groupsContent_controller.js";
import { upload } from "../helper/multer.js";
import express from "express";
const router = express.Router();

router
  .get("/download/:filename", auth, downloadVideos)
  .get("/videos", auth, getVidoesTitle)
  .get("/thumbnail", auth, getTumbnail);
router.post("/upload", auth, upload.single("file"), uploadVideo);

export default router;
