import { Request, Response } from "express";
import User from '../model/User.model';

// Create a new product
export const createUser = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const newUser = new User(data);
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to create user" });
    }
};

// Get all user
export const getAllUser = async (req: Request, res: Response) => {
    try {
      const users = await User.find({}).exec();
      if (users) {
        res.json(users);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to get user" });
    }
}


// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).exec();
        if (user) {
        res.json(user);
        } else {
        res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to get user" });
    }
};

// Update user by ID
export const updateUserById = async (req: Request, res: Response) => {
    try {
    const {address, name, phoneNumber,  } = req.body;
    const avatar: any = req.file;
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: name,
            phoneNumber: phoneNumber,
            address: address, 
            avatar: avatar.location
        },
        { new: true }
    ).exec();
    if (updatedUser) {
        res.json(updatedUser);
    } else {
        res.status(404).json({ error: "User not found" });
    }
    } catch (error) {
        res.status(500).json({ error: "Failed to update user" });
    }
};

// Delete user by ID
export const deleteUserById = async (req: Request, res: Response) => {
    try {
        const deletedUser = await User.findByIdAndUpdate(
            req.params.id,
            { isdelete: true },
            { new: true } // Thêm option { new: true } để trả về sản phẩm đã được cập nhật
        ).exec();
        
        if (deletedUser) {
            res.json(deletedUser);
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
    }
};

module.exports = {
    createUser,
    getAllUser,
    getUserById,
    updateUserById,
    deleteUserById
}