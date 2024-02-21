import auth from "../middleware/authentication.js";
import express from "express";

const router = express.Router();

import { getCreateGroupRequests } from "../controllers/leader_controller.js";

router.get("/leaders/", auth, getCreateGroupRequests);

export default router;
