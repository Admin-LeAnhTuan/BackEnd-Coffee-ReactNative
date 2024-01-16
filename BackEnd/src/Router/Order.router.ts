import express from "express";
import {
    createOrder,
    getAllOrder,
    getOrderById,
    updateOrderById,
    deleteOrderById,
    createPayment,
    Payment_VNP,
} from "../controller/Order.controller";
import { isAuthenticated, isAdminAuthenticated } from "../middleware/IsAuthen.middleware";

const router = express.Router();

router.get("/",isAuthenticated, getAllOrder);
router.post("/create",isAuthenticated, createOrder);
router.get("/:id", getOrderById);
router.put("/:id",isAdminAuthenticated, updateOrderById);
router.put("/:id",isAuthenticated, updateOrderById);
router.delete("/:id",isAdminAuthenticated, deleteOrderById);
router.post("/createPayment",isAuthenticated, createPayment)
router.get("/pay_ipn", Payment_VNP);

export default router;