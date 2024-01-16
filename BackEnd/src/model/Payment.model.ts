import mongoose, {Document, Model, Schema, } from "mongoose";

export interface PaymentDocument extends Document{
    transactionId: string;
    status: string,
    received: number,
    users: mongoose.Types.ObjectId,
    orders: mongoose.Types.ObjectId,
    createAt: Date,
    isDelete: Boolean,
}

export interface PaymentModel extends Model<PaymentDocument>{}

const PaymentSchema = new Schema<PaymentDocument, PaymentModel>({
    transactionId: { 
        type: String, 
        required: [true, "Please enter Transaction id"]
    },
    status: { 
        type: String, 
        required: [true, "Please enter status"]
    },
    received: { 
        type: Number, 
        required: [true, "Please enter received"]
    },
    users: { 
        type: mongoose.Schema.ObjectId,
        ref: "users"
    },
    orders: { 
        type: mongoose.Schema.ObjectId,
        ref: "orders"
    },
    createAt: {
        type: Date,
        default: Date.now(),
    },
    isDelete: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model<PaymentDocument, PaymentModel>("payment", PaymentSchema);