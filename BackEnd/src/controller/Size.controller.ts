import { Request, Response } from "express";
import Size from '../model/Size.model';
import Product from "../model/Product.model";

// Create a new size
export const createSize = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const newSize = new Size(data);
        await newSize.save();

        await Product.findOneAndUpdate(data.productId, 
            { $push: {Size: newSize._id}},
            {new: true}
        )
        res.status(201).json(newSize);
    } catch (error) {
        res.status(500).json({ error: "Failed to create user" });
    }
};

// Get all size
export const getAllSize = async (req: Request, res: Response) => {
    try {
      const sizes = await Size.find({}).exec();
      if (sizes) {
        res.json(sizes);
      } else {
        res.status(404).json({ error: "Size not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to get size" });
    }
}


// Get size by ID
export const getSizeById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const size = await Size.findById(id).exec();
        if (size) {
        res.json({message: "success", data: size});
        } else {
        res.status(404).json({ error: "Size not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to get size" });
    }
};

// Update size by ID
export const updateSizeById = async (req: Request, res: Response) => {
    try {
    const updatedSize = await Size.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    ).exec();
    if (updatedSize) {
        res.json({message: "Updated success", data: updatedSize});
    } else {
        res.status(404).json({ error: "Size not found" });
    }
    } catch (error) {
        res.status(500).json({ error: "Failed to update size" });
    }
};

// Delete size by ID
export const deleteSizeById = async (req: Request, res: Response) => {
    try {
        const deletedSize = await Size.findByIdAndUpdate(
            req.params.id,
            { isdelete: true },
            { new: true } // Thêm option { new: true } để trả về sản phẩm đã được cập nhật
        ).exec();
        
        if (deletedSize) {
            res.json({message: "Deleted Success"});
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
    }
};

module.exports = {
    createSize,
    getAllSize,
    getSizeById,
    updateSizeById,
    deleteSizeById
}