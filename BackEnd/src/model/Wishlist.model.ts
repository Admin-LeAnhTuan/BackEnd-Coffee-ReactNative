import mongoose, { Document, Model, Schema } from "mongoose";

export interface WishListDocument extends Document {
   user: Object,
   products: mongoose.Types.ObjectId[]
}

export interface WishListModel extends Model<WishListDocument> {}

const wishListSchema = new Schema<WishListDocument, WishListModel>({
    user: {
        type: Object,
    },
    products: [
        {
            type: mongoose.Types.ObjectId,
            ref: "products"
        }
    ]
});

export default mongoose.model<WishListDocument, WishListModel>("wishList", wishListSchema);