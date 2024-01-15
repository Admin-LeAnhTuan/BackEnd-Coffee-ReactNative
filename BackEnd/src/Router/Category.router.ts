import express from "express";
import {
    createCategory,
    getAllCategory,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById
} from "../controller/Category.controller";

const router = express.Router();

router.get("/", getAllCategory);
router.post("/create", createCategory);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategoryById);
router.delete("/:id", deleteCategoryById);

export default router;