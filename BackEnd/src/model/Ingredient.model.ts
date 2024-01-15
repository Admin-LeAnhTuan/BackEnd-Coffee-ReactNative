import mongoose, { Document, Model, Schema } from "mongoose";

export interface IngredientDocument extends Document {
   nameIngredient: String,
   createdAt: Date,
   isDelete: Boolean

}

export interface IngredientModel extends Model<IngredientDocument> {}

const ingredientSchema = new Schema<IngredientDocument, IngredientModel>({
    nameIngredient: {
        type: String,
        required:[true, "plase enter name Ingredient"]
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

export default mongoose.model<IngredientDocument, IngredientModel>("ingredient", ingredientSchema);