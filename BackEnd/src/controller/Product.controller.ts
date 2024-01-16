import { Request, Response, response } from "express";
import Product from '../model/Product.model';
import Category from "../model/Category.model";


export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nameProduct, description, price, categoryId, ingredientId } = req.body;
    
        // Find the category by its ID
        const categoryObj = await Category.findById(categoryId).exec();
    
        const file: any = req.file
        // Create the product object
        const product = new Product({
            nameProduct: nameProduct,
            description: description,
            price: price,
            image: file.location,
            category: categoryObj ? categoryObj._id : null,
            size: null,
            ingredient: ingredientId,
        });
    
        // Save the product
        const newProduct = await product.save();
    
        res.status(201).json({ message: 'Product created successfully', data: newProduct });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create product' });
      }
};
  

// Get all size
export const getAllProduct = async (req: Request, res: Response) => {
    try {
      const products = await Product.find({isDelete: false})
      .populate("ingredient")
      .populate("category")
      .populate("size")
      .exec();
      if (products) {
        res.status(200).json({message: "get all success", data: products});
      } else {
        res.status(404).json({ error: "Size not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to get size" });
    }
}


// Get size by ID
export const getProductById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id,{isDelete: false})
        .populate("ingredient")
        .populate("category")
        .populate("size")
        .exec();
        if (product) {
        res.json({message: "success", data: product});
        } else {
        res.status(404).json({ error: "Size not found" });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to get size" });
    }
};

// Update size by ID
export const updateProductById = async (req: Request, res: Response) => {
    try {
    const { nameProduct, description, price, categoryId, sizeIds, ingredientId } = req.body;
    // Find the category by its ID
    const categoryObj = await Category.findById(categoryId).exec();
    
    if (!Array.isArray(sizeIds)) {
      throw new Error('Size IDs should be an array');
    }

    const sizeObjects = sizeIds.map((id: string) => ({ _id: id }));

    const updatedSize = await Product.findByIdAndUpdate(
        req.params.id,
        {
            nameProduct: nameProduct,
            description: description,
            price: price,
            image: req.file?.fieldname,
            category: categoryObj ? categoryObj._id : null,
            size: sizeObjects,
            ingredient: ingredientId,
        },
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
export const deleteOrderById = async (req: Request, res: Response) => {
    try {
        const deletedOrder = await Product.findByIdAndUpdate(
            req.params.id,
            { isdelete: true },
            { new: true } // Thêm option { new: true } để trả về sản phẩm đã được cập nhật
        ).exec();
        
        if (deletedOrder) {
            res.json({message: "Deleted Success"});
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
    }
};

export const findProductByName = async (req:Request, res: Response) => {    
    try {
      const products = await Product.find({nameProduct:{
        $regex: req.params.name,
        $options: "i",
      }, isDelete: false })
      .populate("ingredient")
      .populate("category")
      .populate("size")
      .exec();
      if (products.length > 0) {
        res.status(200).json({message: "get all success", data: products});
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to get size" });
    }
}

export const findProductByCateogry = async (req:Request, res: Response) => {
    const categoryId = req.params.id;
    try {
        const products = await Product.find({category: categoryId, isDelete: false})
        .populate("ingredient")
        .populate("category")
        .populate("size")
        .exec();
        if (products.length > 0) {
          res.status(200).json({message: "get all success", data: products});
        } else {
          res.status(404).json({ error: "Product on CategoryName not found" });
        }
    } catch (error) {
    res.status(500).json({ error: "Failed to get product" });
    }
}


module.exports = {
    createProduct,
    getAllProduct,
    getProductById,
    updateProductById,
    deleteOrderById,
    findProductByCateogry,
    findProductByName
}