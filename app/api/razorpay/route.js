import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import Payment from "@/models/Payment";
import Razorpay from "razorpay";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

export const POST = async (req) => {
    try {
        await connectDb();
        // Log incoming request
        console.log("📥 Incoming Payment Request");

        let body = await req.formData();
        body = Object.fromEntries(body);
        console.log("📩 Received Body Data:", body);

        // Fetch the order from Razorpay to get the notes (metadata)
        const RazorpaySDK = require("razorpay");
        const razorpay = new RazorpaySDK({
            key_id: process.env.NEXT_PUBLIC_KEY_ID,
            key_secret: process.env.KEY_SECRET
        });
        let order;
        try {
            order = await razorpay.orders.fetch(body.razorpay_order_id);
        } catch (err) {
            console.error("❌ Order fetch failed:", err);
            return NextResponse.json({ success: false, message: "Order fetch failed", error: err.message }, { status: 500 });
        }
        const notes = order.notes || {};
        const to_user = notes.to_user;
        if (!to_user) {
            console.error("❌ to_user missing in order notes");
            return NextResponse.json({ success: false, message: "to_user missing in order notes" }, { status: 400 });
        }
        // Fetch the user receiving the payment
        let user = await User.findOne({ username: to_user }).select("razorpaysecret");
        if (!user) {
            console.error("❌ User not found in database:", to_user);
            return NextResponse.json({ success: false, message: "User not found in database" }, { status: 404 });
        }
        console.log("👤 User found:", user);

        // Extract and clean the secret key
        const secret = user?.razorpaysecret;
        console.log("Raw Secret:", secret);

        if (!secret || secret.length < 10) {
            console.error("❌ Secret key retrieval failed. Debugging data:", {
                user,
                extractedSecret: `"${secret}"`,
                type: typeof secret
            });
            return NextResponse.json({ success: false, message: "Secret key is missing or invalid" }, { status: 400 });
        }

        console.log("✅ Razorpay Secret Retrieved Successfully:", secret);
        console.log("🔍 Secret Key ASCII Values:", [...secret].map(c => c.charCodeAt(0)));

        // Verify payment
        let xx;
        try {
            xx = validatePaymentVerification(
                { order_id: body.razorpay_order_id, payment_id: body.razorpay_payment_id },
                body.razorpay_signature,
                secret
            );
        } catch (err) {
            console.error("❌ Payment signature verification error:", err);
            return NextResponse.json({ success: false, message: "Payment signature verification error", error: err.message }, { status: 400 });
        }

        if (xx) {
            console.log("✅ Payment Verification Successful");
            // Create the Payment record only after successful verification, using notes
            let newPayment;
            try {
                newPayment = await Payment.create({
                    name: notes.name,
                    to_user: to_user,
                    oid: body.razorpay_order_id,
                    amount: notes.amount,
                    message: notes.message,
                    done: "true"
                });
            } catch (err) {
                console.error("❌ Payment DB create error:", err);
                return NextResponse.json({ success: false, message: "Payment DB create error", error: err.message }, { status: 500 });
            }
            console.log("✅ Payment Created Successfully:", newPayment);
            // Redirect to the same page with paymentdone param
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/${to_user}?paymentdone=true`);
        } else {
            console.error("❌ Payment Verification Failed. Debug Info:", {
                order_id: body.razorpay_order_id,
                payment_id: body.razorpay_payment_id,
                signature: body.razorpay_signature,
                secret,
            });
            return NextResponse.json({ success: false, message: "Payment Verification Failed" }, { status: 400 });
        }
    } catch (err) {
        console.error("❌ Unhandled error in /api/razorpay:", err);
        return NextResponse.json({ success: false, message: "Unhandled server error", error: err.message }, { status: 500 });
    }
};
