import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface UserDocument extends Document {
    name: string,
    phoneNumber: string,
    email: string,
    password: string,
    address: string,
    role: string,
    avatar: string,
    createdAt: Date,
    resetPasswordToken?: string,
    resetPasswordTime?: Date,
    getJwtToken: () => string,
    comparePassword: (enteredPassword: string) => Promise<boolean>,
}

export interface UserModel extends Model<UserDocument> {}

const userSchema = new Schema<UserDocument, UserModel>({
    name: {
        type: String,
        required: [true, "Please enter your name!"],
    },
    phoneNumber: {
        type: String,
        required: [true, "Please enter your phone number!"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email address"],
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [6, "Password should be greater than 6 characters"],
        select: false,
    },
    address:  {
        type: String,
        default: ""
    },
    role: {
        type: String,
        default: "user",
    },
    avatar: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: {
        type: String,
        default: undefined
    },
    resetPasswordTime: {
        type: Date,
        default: undefined
    },
});

// Hash password
userSchema.pre<UserDocument>("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY!, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

// compare password
userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<UserDocument, UserModel>("users", userSchema);