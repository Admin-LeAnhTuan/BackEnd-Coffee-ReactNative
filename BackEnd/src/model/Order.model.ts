import mongoose, { Document, Model, Schema } from "mongoose";

export interface OrderDocument extends Document {
   users: mongoose.Types.ObjectId,
   products: mongoose.Types.ObjectId[],
   total: Number,
   statusPayment: boolean,
   Ordertransport: String,
   createdAt: Date,
   isDelete: Boolean
}

export interface OrderModel extends Model<OrderDocument> {}

const orderSchema = new Schema<OrderDocument, OrderModel>({
    users: {
        type: mongoose.Schema.ObjectId,
        ref: "users"
    },
    products: [
        {
            type: mongoose.Types.ObjectId,
            ref: "products"
        }
    ],
    total: {
        type: Number,
        required: [true, "plase enter total order"],
    },
    statusPayment: {
        type: Boolean,
        default: false
    },
    Ordertransport: {
        type: String,
        enum: ["Cancel", "Wait", "Success"],
        default: "Wait"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isDelete: {
        type: Boolean,
        default: false
    }
});


export default mongoose.model<OrderDocument, OrderModel>("order", orderSchema);