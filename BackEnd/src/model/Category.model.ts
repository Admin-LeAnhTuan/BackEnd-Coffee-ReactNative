import mongoose, { Document, Model, Schema } from "mongoose";

export interface CategoryDocument extends Document {
   name: String,
   createdAt: Date,
   isDelete: Boolean

}

export interface CategoryModel extends Model<CategoryDocument> {}

const categorySchema = new Schema<CategoryDocument, CategoryModel>({
    name: {
        type: String,
        required:[true, "plase enter name Cateogry"]
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

export default mongoose.model<CategoryDocument, CategoryModel>("category", categorySchema);