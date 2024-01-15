import express from "express";
import {
    createSize,
    getAllSize,
    getSizeById,
    updateSizeById,
    deleteSizeById
} from "../controller/Size.controller";
import { isAdminAuthenticated } from "../middleware/IsAuthen.middleware";

const router = express.Router();

router.get("/",isAdminAuthenticated, getAllSize);
router.post("/create",isAdminAuthenticated, createSize);
router.get("/:id",isAdminAuthenticated, getSizeById);
router.put("/:id",isAdminAuthenticated, updateSizeById);
router.delete("/:id",isAdminAuthenticated, deleteSizeById);

export default router;