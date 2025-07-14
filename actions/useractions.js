"use server";

import Razorpay from "razorpay";
import Payment from "@/models/Payment";
import User from "@/models/User";
import connectDB from "@/db/connectDb";
import dotenv from 'dotenv';

dotenv.config();

export const initiate = async (amount, to_username, paymentform) => {
    await connectDB();
    var instance = new Razorpay({
        key_id: process.env.NEXT_PUBLIC_KEY_ID,
        key_secret: process.env.KEY_SECRET
    });

    let options = {
        amount: Number.parseInt(amount),
        currency: "INR",
        receipt: "receipt#1",
        payment_capture: 1,
        notes: {
            to_user: to_username,
            name: paymentform.name,
            message: paymentform.message,
            amount: amount
        }
    }

    let x = await instance.orders.create(options);

    // Do NOT create a Payment record here anymore
    // await Payment.create({
    //     name: paymentform.name,
    //     to_user: to_username,
    //     oid: x.id,
    //     amount: amount,
    //     message: paymentform.message
    // });

    return x;
}

export const fetchuser = async (username) => {
    try {
        await connectDB();
        console.log("Fetching user:", username); // Debugging log before query

        let u = await User.findOne({ username: username }).lean();

        if (!u) {
            console.log("User not found:", username); // Debugging log if user is missing
            return null;
        }

        console.log("User found:", u); // Debugging log for found user

        return {
            ...u,
            _id: u._id.toString()  // Convert ObjectId to string
        };
    } catch (error) {
        console.error("Error fetching user:", error); // Debugging log for errors
        return { error: "Error fetching user" };
    }
};


export const fetchpayments = async (username) => {
    await connectDB();

    let payments = await Payment.find({ to_user: username }).sort({ amount: -1 }).limit(5).lean();


    return payments.map(payment => ({
        ...payment,
        _id: payment._id.toString(),  // Convert ObjectId to string
        createdAt: payment.createdAt.toISOString(), // Convert Date to string
        updatedAt: payment.updatedAt.toISOString()  // Convert Date to string
    }));
};

export const updateProfile = async (data, oldusername) => {
    await connectDB(); 
    let ndata = data;

    console.log("🔍 Received Update Data:", ndata);

    let existingUser = await User.findOne({ email: ndata.email });
    console.log("🔍 Existing User Data:", existingUser);

    let result = await User.updateOne(
        { email: ndata.email },
        { $set: { 
            profilepic: ndata.profilepic, 
            coverpic: ndata.coverpic,
            razorpayid: ndata.razorpayid,
            razorpaysecret: ndata.razorpaysecret
        } }
    );

    console.log("✅ MongoDB Update Result:", result);

    let updatedUser = await User.findOne({ email: ndata.email });
    console.log("✅ Updated User in MongoDB:", updatedUser);

    return { success: true };
};
