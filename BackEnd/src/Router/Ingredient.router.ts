import express from "express";
import {
    createIngredient,
    getAllIngredient,
    getIngredientById,
    updateIngredientById,
    deleteIngredientById
} from "../controller/Ingredient.controller";

const router = express.Router();

router.get("/", getAllIngredient);
router.post("/create", createIngredient);
router.get("/:id", getIngredientById);
router.put("/:id", updateIngredientById);
router.delete("/:id", deleteIngredientById);

export default router;