import express from "express";
import {
    createPaymentSuccess
} from "../controller/Payment.controller";
import { isAuthenticated, isAdminAuthenticated } from "../middleware/IsAuthen.middleware";

const router = express.Router();

router.post("/paymentSuccess", createPaymentSuccess)

export default router;