import {Request, Response, NextFunction } from "express";
import Payment from "../model/Payment.model";
import sendMail from "../utils/SendEmail.utils"

export const createPaymentSuccess = async (req:Request, res: Response) => {
    try {
        let paymentData = req.body;
        const isExist = await Payment.findOne({
            transactionId: paymentData.transactionId,
        });
        if (isExist) {
            res.status(500).json({message: "Transaction already exists"})
            return;
        }
        paymentData.status = "success"
        const orders = paymentData.orderId;
        let users: string | null = null; // nullable
        if (paymentData.userId) {
            users = paymentData.userId;
        }
        const newPayment = new Payment(paymentData);
        const payment = await newPayment.save();
        res.status(201).json({message: "success", data: payment});
    } catch (error) {
        res.status(500).json({error: "Error create payment"})
    }
}


module.exports = {
    createPaymentSuccess
}
