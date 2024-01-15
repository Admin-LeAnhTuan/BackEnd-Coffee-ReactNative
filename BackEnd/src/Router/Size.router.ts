import express from "express";
import {
    createSize,
    getAllSize,
    getSizeById,
    updateSizeById,
    deleteSizeById
} from "../controller/Size.controller";

const router = express.Router();

router.get("/", getAllSize);
router.post("/create", createSize);
router.get("/:id", getSizeById);
router.put("/:id", updateSizeById);
router.delete("/:id", deleteSizeById);

export default router;