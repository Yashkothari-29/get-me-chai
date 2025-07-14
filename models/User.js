import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
    },
    username: {
        type: String,
        required: true
    },
    profilepic: {
        type: String,
        default: "https://res.cloudinary.com/dqcsk8rsc/image/upload/v1631017205/nextauth/placeholder.png"
    },
    coverpic: {
        type: String,
        default: "https://res.cloudinary.com/dqcsk8rsc/image/upload/v1631017205/nextauth/placeholder.png"
    },

    razorpayid: {
        type: String,
        select: true  // ✅ Ensure this field is selectable
    },
    razorpaysecret: {  
        type: String,  
        select: true  // ✅ Ensure this field is selectable
    },
    password: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {    
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        default: null
    },
    passwordResetToken: {
        type: String,
        default: null
    },
    passwordResetExpires: {
        type: Date,
        default: null
    }
});

export default mongoose.models.User || model("User", UserSchema);
