import mongoose, { Document, Model, Schema } from "mongoose";

export interface ProductDocument extends Document {
    nameProduct: String,
    description: String,
    price: Number,
    image: String,
    category: mongoose.Types.ObjectId,
    size: mongoose.Types.ObjectId[],
    ingredient: mongoose.Types.ObjectId[],
    createdAt: Date,
    isDelete: Boolean,
}

export interface ProductModel extends Model<ProductDocument> {}

const productSchema = new Schema<ProductDocument, ProductModel>({
    nameProduct: {
        type: String,
        required: [true, "Plase enter name Product"]
    },
    description: {
        type: String,
        required: [true, "Plase enter description Product"]
    },
    price: {
        type: Number,
        required: [true, "Plase enter price Product"]
    },
    image: {
        type: String,
        required: [true, "Plase enter image Product"]
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
    },
    size: [
        {
            type: mongoose.Types.ObjectId,
            ref: "size"
        }
    ],
    ingredient: [
        {
            type: mongoose.Types.ObjectId,
            ref: "ingredient"
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    isDelete: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model<ProductDocument, ProductModel>("products", productSchema);