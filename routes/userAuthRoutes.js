import express from "express";
const router = express.Router();

import { login, logout, register, deleteAllUsers } from "../controllers/user_controller.js";

// create the user
router.post("/", register).post("/login", login);
router.delete("/logout", logout).delete("/deleteAllUsers", deleteAllUsers);

export default router;
