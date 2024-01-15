import { Request, Response } from "express";
import Category from '../model/Category.model';

// Create a new category
export const createCategory = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const newCategory = new Category(data);
      await newCategory.save();
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ error: "Failed to create user" });
    }
};

// Get all size
export const getAllCategory = async (req: Request, res: Response) => {
    try {
      const sizes = await Category.find({isDelete: false}).exec();
      if (sizes) {
        res.json(sizes);
      } else {
        res.status(404).json({ error: "Category not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to get size" });
    }
}


// Get catgory by ID
export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const catgory = await Category.findById(id, {isDelete: false}).exec();
        if (catgory) {
        res.json({message: "success", data: catgory});
        } else {
        res.status(404).json({ error: "Category not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to get catgory" });
    }
};

// Update catgory by ID
export const updateCategoryById = async (req: Request, res: Response) => {
    try {
    const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    ).exec();
    if (updatedCategory) {
        res.json({message: "Updated success", data: updatedCategory});
    } else {
        res.status(404).json({ error: "Size not found" });
    }
    } catch (error) {
        res.status(500).json({ error: "Failed to update size" });
    }
};

// Delete size by ID
export const deleteCategoryById = async (req: Request, res: Response) => {
    try {
        const deletedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { isdelete: true },
            { new: true } // Thêm option { new: true } để trả về sản phẩm đã được cập nhật
        ).exec();
        
        if (deletedCategory) {
            res.json({message: "Deleted Success"});
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
    }
};

module.exports = {
    createCategory,
    getAllCategory,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById
}