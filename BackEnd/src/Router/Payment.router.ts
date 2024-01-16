import express from "express";
import {
    CreeatePayment,
    PaymentSuccess,
    PaymentCancel
} from "../controller/Payment.controller";
import { isAuthenticated, isAdminAuthenticated } from "../middleware/IsAuthen.middleware";

const router = express.Router();

router.post("/create", CreeatePayment)
router.get("/success", PaymentSuccess)
router.get("/cancel", PaymentCancel)

export default router;