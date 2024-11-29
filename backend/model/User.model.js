import mongoose from "mongoose";
import validator from "validator";

export const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (email) {
                return validator.isEmail(email); // Using validator.js to validate email format
            },
            message: "Please enter a valid email",
        },
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    lastLogin: {
        type: Boolean,
        default: true,
        require: true,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
}, { timestamps: true })

export const User = mongoose.model('User', userSchema)