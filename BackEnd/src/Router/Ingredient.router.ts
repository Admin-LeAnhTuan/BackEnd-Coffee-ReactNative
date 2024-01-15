import express from "express";
import {
    createIngredient,
    getAllIngredient,
    getIngredientById,
    updateIngredientById,
    deleteIngredientById
} from "../controller/Ingredient.controller";
import { isAdminAuthenticated } from "../middleware/IsAuthen.middleware";

const router = express.Router();

router.get("/",isAdminAuthenticated, getAllIngredient);
router.post("/create",isAdminAuthenticated, createIngredient);
router.get("/:id",isAdminAuthenticated, getIngredientById);
router.put("/:id",isAdminAuthenticated, updateIngredientById);
router.delete("/:id",isAdminAuthenticated, deleteIngredientById);

export default router;