import { Request, Response } from "express";
import  WishList  from '../model/Wishlist.model';
import User from "../model/User.model";



// Get size by ID
export const getWishListByUser= async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const wishList = await WishList.findOne({userId}).exec();
        if (wishList) {
        res.json({message: "success", data: wishList});
        } else {
        res.status(404).json({ error: "Size not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to get size" });
    }
};

// Update size by ID
export const updateWishListByUser= async (req: Request, res: Response) => {
    try {
    const {userId, ProductId} = req.body;
    const wishList = await WishList.findOne({userId}).exec();
    if(wishList) {
        await WishList.findByIdAndUpdate(
            wishList.id,
            {$push: ProductId},
            {new: true}).exec();
    }
    else {
        const userAccount = await User.findOne({userId}).exec();
        const newWishList = new  WishList({
            user: userAccount,
            products: []
        })
        newWishList.save();
        await WishList.findByIdAndUpdate(
            newWishList.id,
            {$push: ProductId},
            {new: true}).exec();
    }
    
    } catch (error) {
        res.status(500).json({ error: "Failed to update size" });
    }
};

// Delete size by ID
export const deleteWishListByUser = async (req: Request, res: Response) => {
    try {
        const {userId, productId} = req.body;
        const wishList = await WishList.findOneAndUpdate(userId,
            {$pull: productId},
            {new: true}).exec();
        
        if (wishList) {
            res.json({message: "Deleted Success"});
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
    }
};

module.exports = {
    getWishListByUser,
    updateWishListByUser,
    deleteWishListByUser
}