import mongoose, { Document, Model, Schema } from "mongoose";

export interface SizeDocument extends Document {
   nameSize: String,
   price: Number,
   createdAt: Date,
   isDelete: Boolean

}

export interface SizeModel extends Model<SizeDocument> {}

const sizeSchema = new Schema<SizeDocument, SizeModel>({
    nameSize: {
        type: String,
        required:[true, "plase enter name Size"]
    },
    price: {
        type: Number,
        required: [true, "plase enter price in Size"]
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

export default mongoose.model<SizeDocument, SizeModel>("size", sizeSchema);