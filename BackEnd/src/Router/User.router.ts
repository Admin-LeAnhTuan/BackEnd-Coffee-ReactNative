import express from "express";
import {
    createUser,
    getAllUser,
    getUserById,
    updateUserById,
    deleteUserById
} from "../controller/User.controller";
import { isAdminAuthenticated, isAuthenticated } from "../middleware/IsAuthen.middleware";
import { upload } from "../utils/Multer.utils";


const router = express.Router();

router.get("/",isAdminAuthenticated, getAllUser);
router.post("/create", createUser);
router.get("/:id",isAdminAuthenticated, getUserById);
router.put("/:id",isAuthenticated, upload.single("avatar"), updateUserById);
router.delete("/:id",isAdminAuthenticated, deleteUserById);

export default router;