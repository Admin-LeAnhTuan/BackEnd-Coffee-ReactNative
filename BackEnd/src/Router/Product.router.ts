import express from "express";
import {
    createProduct,
    getAllProduct,
    getProductById,
    updateProductById,
    deleteOrderById,
    findProductByCateogry,
    findProductByName
} from "../controller/Product.controller";
import { upload } from "../utils/Multer.utils";

const router = express.Router();

router.get("/", getAllProduct); 
router.post("/create", upload.single("image"), createProduct);
router.get("/:id", getProductById);
router.put("/:id", updateProductById);
router.get("/name/:name", findProductByName);
router.get("/category/:id", findProductByCateogry);
router.delete("/:id", deleteOrderById);

export default router;