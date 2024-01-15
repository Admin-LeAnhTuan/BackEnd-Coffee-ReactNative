import { Request, Response } from "express";
import Ingredient from '../model/Ingredient.model';

// Create a new ingredient
export const createIngredient = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const newIngredient = new Ingredient(data);
      await newIngredient.save();
      res.status(201).json(newIngredient);
    } catch (error) {
        console.log(error)
      res.status(500).json({ error: "Failed to create ingredient" });
    }
};

// Get all Ingredient
export const getAllIngredient = async (req: Request, res: Response) => {
    try {
      const ingredients = await Ingredient.find({}).exec();
      if (ingredients) {
        res.json(ingredients);
      } else {
        res.status(404).json({ error: "Size not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to get size" });
    }
}


// Get size by ID
export const getIngredientById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const ingredients = await Ingredient.findById(id).exec();
        if (ingredients) {
        res.json({message: "success", data: ingredients});
        } else {
        res.status(404).json({ error: "Size not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to get ingredients" });
    }
};

// Update size by ID
export const updateIngredientById = async (req: Request, res: Response) => {
    try {
    const updatedIngredient = await Ingredient.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    ).exec();
    if (updatedIngredient) {
        res.json({message: "Updated success", data: updatedIngredient});
    } else {
        res.status(404).json({ error: "Size not found" });
    }
    } catch (error) {
        res.status(500).json({ error: "Failed to update size" });
    }
};

// Delete size by ID
export const deleteIngredientById = async (req: Request, res: Response) => {
    try {
        const deletedIngredient = await Ingredient.findByIdAndUpdate(
            req.params.id,
            { isdelete: true },
            { new: true } // Thêm option { new: true } để trả về sản phẩm đã được cập nhật
        ).exec();
        
        if (deletedIngredient) {
            res.json({message: "Deleted Success"});
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
    }
};

module.exports = {
    createIngredient,
    getAllIngredient,
    getIngredientById,
    updateIngredientById,
    deleteIngredientById
}