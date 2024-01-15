import express from "express";
import {
    createCategory,
    getAllCategory,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById
} from "../controller/Category.controller";
import { isAdminAuthenticated } from "../middleware/IsAuthen.middleware";

const router = express.Router();

router.get("/", getAllCategory);
router.post("/create",isAdminAuthenticated, createCategory);
router.get("/:id", getCategoryById);
router.put("/:id",isAdminAuthenticated, updateCategoryById);
router.delete("/:id",isAdminAuthenticated, deleteCategoryById);

export default router;