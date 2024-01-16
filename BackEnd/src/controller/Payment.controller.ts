import {Request, Response, NextFunction } from "express";
import Payment from "../model/Payment.model";
import axios from "axios";
var paypal = require('paypal-rest-sdk');

// values env
const HOST: String | undefined = process.env.HOST
const CLIENT_ID: String | undefined = process.env.CLIENT_ID
const CLIENT_SECRET: String | undefined= process.env.CLIENT_SECRET
const API = process.env.PAYPAL_API



paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
});


export const CreeatePayment = async (req:Request, res: Response) => {
    const {total} = req.body;
    try {
        const order = {
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: total,
              },
            },
          ],
          application_context: {
            brand_name: "mycompany.com",
            landing_page: "NO_PREFERENCE",
            user_action: "PAY_NOW",
            return_url: `${HOST}/payment/success`,
            cancel_url: `${HOST}/payment/cancel`,
          },
        };
    
        console.log(order)
        // format the body
        const params = new URLSearchParams();
        params.append("grant_type", "client_credentials");
    
        // Generate an access token
        const {
          data: { access_token },
        } = await axios.post(
          "https://api-m.sandbox.paypal.com/v1/oauth2/token",
          params,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            auth: {
              username: "ASXgvplFmMiL-LWvUvgS_khWQSilFwcVJAPR3wpFAQ69Fl8SQvB7Qt_CIoW2wEU6hOtoSzVmoaC3_fKu",
              password: "ECTdq1iWVs6XFDP3nRXJXcXXR4LlJIwMz29IeRd_HGHMI8KFdVBWzYQ4OIN-ped0gKMG1Zx5Mr5EVkv8",
            },
          }
        );
    
        console.log(access_token);
    
        // make a request
        const response = await axios.post(
          `${API}/v2/checkout/orders`,
          order,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
    
        console.log(response.data);
    
        return res.json(response.data);
      } catch (error) {
        console.log(error);
        return res.status(500).json("Something goes wrong");
      }
}


export const PaymentSuccess = async (req: Request, res: Response) => {
    const { token } = req.query;
  
    try {
      const response = await axios.post(
        `${API}/v2/checkout/orders/${token}/capture`,
        {},
        {
            auth: {
                username: "ASXgvplFmMiL-LWvUvgS_khWQSilFwcVJAPR3wpFAQ69Fl8SQvB7Qt_CIoW2wEU6hOtoSzVmoaC3_fKu",
                password: "ECTdq1iWVs6XFDP3nRXJXcXXR4LlJIwMz29IeRd_HGHMI8KFdVBWzYQ4OIN-ped0gKMG1Zx5Mr5EVkv8",
            },
        }
      );
  
      console.log(response.data);
  
      res.status(200).json({sucess: "sucess", data: response.data})
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server error" });
    }
};


export const PaymentCancel = async (req:Request, res: Response) => {
    console.log("error")
    res.status(200).json({message: "Payment cancel success" })
    // res.redirect("/");
}


module.exports = {
    CreeatePayment,
    PaymentSuccess,
    PaymentCancel
}
