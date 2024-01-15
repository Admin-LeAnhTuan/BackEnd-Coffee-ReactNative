import mongoose, { Document, Model, Schema } from "mongoose";

export interface ItemDocument extends Document {
    nameProduct: String,
    description: String,
    price: Number,
    image: String,
    category: mongoose.Types.ObjectId,
    size: String,
    ingredient: mongoose.Types.ObjectId[],
}

export interface ItemModel extends Model<ItemDocument> {}

const itemSchema = new Schema<ItemDocument, ItemModel>({
    nameProduct: {
        type: String,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
    },
    image: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
    },
    size: {
        type: String,
    },
    ingredient: [
        {
            type: mongoose.Types.ObjectId,
            ref: "ingredient"
        }
    ]
});

export default mongoose.model<ItemDocument, ItemModel>("item", itemSchema);