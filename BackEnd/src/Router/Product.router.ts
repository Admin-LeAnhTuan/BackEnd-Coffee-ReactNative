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
import { isAuthenticated, isAdminAuthenticated } from "../middleware/IsAuthen.middleware";

const router = express.Router();

router.get("/",isAuthenticated, getAllProduct); 
router.post("/create",isAdminAuthenticated, upload.single("image"), createProduct);
router.get("/:id",isAuthenticated, getProductById);
router.put("/:id",isAdminAuthenticated, updateProductById);
router.get("/name/:name",isAuthenticated, findProductByName);
router.get("/category/:id",isAuthenticated, findProductByCateogry);
router.delete("/:id",isAdminAuthenticated, deleteOrderById);

export default router;