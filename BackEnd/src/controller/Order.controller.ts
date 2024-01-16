import { NextFunction, Request, Response } from "express";
import Order from '../model/Order.model';
import User from "../model/User.model"
import { FormatDateOrderId } from "../middleware/Format.middlewarre";
const sortObject = require("sort-object");
import queryString from "qs"
import crypto from "crypto"
import config from "config"


// Create a new size
export const createOrder = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const user = await User.findById(data.userId).exec();
        console.log(user)
        const products = data.productIds.map((id: string) => ({ _id: id }));
        const newOrder: any= {
            users : user,
            products: products,
            total: data.total,
        }
        const newOrders = new Order(newOrder);
        await newOrders.save();
        res.status(201).json(newOrder);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to create order" });
    }
};

// Get all size
export const getAllOrder = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({isDelete: false})
        .populate({ path: "products", options: { strictPopulate: false } })
        .populate({ path: "users", options: { strictPopulate: false } })
        .exec();
      if (orders.length > 0) {
        res.json(orders);
      } else {
        res.status(404).json({ error: "Size not found" });
      }
    } catch (error) {
        console.log(error)
      res.status(500).json({ error: "Failed to get size" });
    }
}


// Get size by ID
export const getOrderById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const order = await Order.findById(id,{isDelete: false})
        .populate({ path: "products", options: { strictPopulate: false } })
        .populate({ path: "users", options: { strictPopulate: false } })
        .exec();
        if (order) {
        res.json({message: "success", data: order});
        } else {
        res.status(404).json({ error: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to get Order" });
    }
};

// Update size by ID
export const updateOrderById = async (req: Request, res: Response) => {
    try {
    const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    ).exec();
    if (updatedOrder) {
        res.json({message: "Updated success", data: updatedOrder});
    } else {
        res.status(404).json({ error: "Order not found" });
    }
    } catch (error) {
        res.status(500).json({ error: "Failed to update size" });
    }
};

// Delete order by ID
export const deleteOrderById = async (req: Request, res: Response) => {
    try {
        const deletedOrder = await Order.findByIdAndUpdate(
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

export const OrdertransportCancel = async (req:Request, res: Response) => {
    try {
        const id = req.params.id;
        const updateCancel = await Order.findByIdAndUpdate(id, {
            Ordertransport: 0
        }).exec();
        if(updateCancel) {
            res.status(200).json({message: "Cancel Success"});
        }
        else {
            res.status(404).json({ error: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to updated order transport" });
    }
}

export const OrdertransportSuccess = async (req:Request, res: Response) => {
    try {
        const id = req.params.id;
        const updateSuccess = await Order.findByIdAndUpdate(id, {
            Ordertransport: "Cancel"
        }).exec();
        if(updateSuccess) {
            res.status(200).json({message: "Order Success"});
        }
        else {
            res.status(404).json({ error: "Order not found" });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to updated order transport" });
    }
}

// Payment with VNPay

type ExpressResponse = Response<any>;

function handleRedirect(res: ExpressResponse, url: string): void {
  if (res.headersSent) {
    // Headers have already been sent, so return early
    return;
  }

  res.setHeader('Location', url);
  res.statusCode = 302;
  
}

function pad2(n: number) {
    return (n < 10 ? "0" : "") + n;
}
  
  
function dateFormatAll(date: Date) {
    let dateFormated =
        date.getFullYear() +
        pad2(date.getMonth() + 1) +
        pad2(date.getDate()) +
        pad2(date.getHours()) +
        pad2(date.getMinutes()) +
        pad2(date.getSeconds());

    return dateFormated;
}

export const createPayment = async (req:Request, res: Response, Next: NextFunction) => {
    try {
        var ipAdr: string| string[] | undefined = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress;
        var tmnCode: string | undefined = process.env.VNP_TMNCODE;
        var secretKey: string | undefined = process.env.VPN_HASHSECRET;
        var VNP_Url: string | undefined = process.env.VNP_URL;
        var ReturnUrl: string| undefined = process.env.RETURN_URL;
        var date = new Date();
        var createDate: string = dateFormatAll(date);
        var orderDate: string= FormatDateOrderId(date);
        var amount: number = Number(req.body.paymentInfo.amount);
        var orderId: string = req.body.paymentInfo.orderId;
        var userId: string = req.body.paymentInfo.userId;
        var bankcode: string =  "";
        var currCode: string = "VND";
        var VNP_Params: any = {};
        var vnp_Version: string = "2.1.0";
        var vnp_Command: string = "pay";
        var vnp_OrderType: string = "other";
        var locale: string = req.body.language;
        if(locale === null || locale === "") {
            locale = "vn";
        } 

        VNP_Params["vnp_Version"] = vnp_Version;
        VNP_Params["vnp_Command"] = vnp_Command;
        VNP_Params["vnp_TmnCode"] = tmnCode;
        VNP_Params["vnp_Locale"] = locale;
        VNP_Params["vnp_CurrCode"] = currCode;
        VNP_Params["vnp_TxnRef"] = orderId;
        VNP_Params["vnp_OrderInfo"] = orderDate;
        VNP_Params["vnp_OrderType"] = vnp_OrderType;
        VNP_Params["vnp_Amount"] = amount * 100000;
        VNP_Params["vnp_ReturnUrl"] = ReturnUrl + `?orderId=${orderId}&userId=${userId}`;
        VNP_Params["vnp_IpAddr"] = ipAdr;
        VNP_Params["vnp_Locale"] = "vn";
        VNP_Params["vnp_CreateDate"] = createDate;
        if (bankcode !== null && bankcode !== "") {
          VNP_Params["vnp_BankCode"] = bankcode;
        }
    
        var locale: string = req.body.language;
        if (locale === null || locale === "") {
          locale = "vn";
        }
    
        // Các thuộc tính phù hợp với định dạng của VNPAY
        VNP_Params = sortObject(VNP_Params);
        console.log(VNP_Params)
    
        if (bankcode !== null && bankcode !== "") {
          VNP_Params["vnp_BankCode"] = bankcode;
        }
    
        var querystring = require("qs");
        var signData = querystring.stringify(VNP_Params, { encode: true });
        var crypto = require("crypto");
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
        VNP_Params["vnp_SecureHash"] = signed;
        VNP_Url += "?" + querystring.stringify(VNP_Params, { encode: true });
        if(!secretKey) {
          throw new Error('secretKey environment variable is not defined.');
        }
        
        res.status(201).json({
          success: true,
          VNP_Url,
        })
        console.log(VNP_Url)
        if(!VNP_Url) {
          throw new Error("VNPAY URL envirionment variable is not defined");
        }
        handleRedirect(res, VNP_Url);
     
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to updated order transport" });
    }
}
// success payment
export const Payment_Success = async (req: Request, res: Response, next: NextFunction) =>{
    var VNP_Params: any = req.body;
    
    var secureHash: string = VNP_Params["vnp_SecureHash"];
    delete VNP_Params["vnp_SecureHash"];
    delete VNP_Params["vnp_SecureHashType"];
    var tmnCode: string = config.get("vnp_TmnCode");
    var secretKey: string = config.get("vnp_HashSecret");

    var singData = queryString.stringify(VNP_Params, {encode: true});

    if(!secretKey) {
      throw new Error('secretKey environment variable is not defined.');
    }
    
    var hmac = crypto.createHmac("sha512",secretKey);
    var signed = hmac.update(Buffer.from(singData, "utf-8")).digest("hex");
    
    if(secureHash === signed) {
      // Kiem tra
      res.render("success", {code: VNP_Params["vnp_ResponseCode"]});
    } else {
    res.render("success", {code: "97"});
    }
};


export const Payment_VNP = async (req: Request, res: Response, next: NextFunction) => {
    var vnp_Params = req.query;
    var secureHash = vnp_Params["np_SecureHash"];
  
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];
  
    var secretKey = process.env.VPN_HASHSECRET;
    var signData = queryString.stringify(vnp_Params, {encode: false});
    if(!secretKey) {
      throw new Error('secretKey environment variable is not defined.');
    }
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    if (secureHash === signed) {
      var orderId = vnp_Params["vnp_TxnRef"];
      var rspCode = vnp_Params["vnp_ResponseCode"];
      //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
      res.status(200).json({ RspCode: "00", Message: "success" });
    } else {
      res.status(200).json({ RspCode: "97", Message: "Fail checksum" });
    }
  
}


module.exports = {
    createOrder,
    getAllOrder,
    getOrderById,
    updateOrderById,
    deleteOrderById,
    createPayment,
    Payment_VNP,
}