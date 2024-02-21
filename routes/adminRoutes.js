import auth from "../middleware/authentication.js";
import express from "express";
const router = express.Router();
import {
  getUsers,
  searchUserByName,
  updateUserRole,
  updateUserPackageType,
} from "../controllers/admin_controller.js";

router.get("/users", auth, getUsers);
router.post("/search", auth, searchUserByName);
router
  .put("/update-role/:id", auth, updateUserRole)
  .put("/update-package-type/:id", auth, updateUserPackageType);

export default router;
