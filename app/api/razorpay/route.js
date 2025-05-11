import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import Payment from "@/models/Payment";
import Razorpay from "razorpay";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

export const POST = async (req) => {
    await connectDb();
    
    // Log incoming request
    console.log("📥 Incoming Payment Request");

    let body = await req.formData();
    body = Object.fromEntries(body);
    console.log("📩 Received Body Data:", body);

    // Check if razorpayOrderId exists
    let p = await Payment.findOne({ oid: body.razorpay_order_id });
    if (!p) {
        console.log("❌ Order ID not found in Payment collection");
        return NextResponse.json({ success: false, message: "Order Id not found" });
    }
    console.log("✅ Order Found:", p);

    // Log the username associated with the order
    console.log("🔍 Fetching user with username:", p.to_user);

    // Fetch the user receiving the payment
    let user = await User.findOne({ username: p.to_user }).select("razorpaysecret");



    if (!user) {
        console.log("❌ User not found in database:", p.to_user);
        return NextResponse.json({ success: false, message: "User not found in database" });
    }

    console.log("👤 User found:", user);

    // Extract and clean the secret key
    const secret = user?.razorpaysecret;
console.log("Raw Secret:", secret);


    if (!secret || secret.length < 10) {  
        console.log("❌ Secret key retrieval failed. Debugging data:", { 
            user, 
            extractedSecret: `"${secret}"`, 
            type: typeof secret 
        });
        return NextResponse.json({ success: false, message: "Secret key is missing or invalid" });
    }

    console.log("✅ Razorpay Secret Retrieved Successfully:", secret);

    // Debugging secret by logging ASCII values (to check for hidden characters)
    console.log("🔍 Secret Key ASCII Values:", [...secret].map(c => c.charCodeAt(0)));

    

    // Verify payment
    let xx = validatePaymentVerification(
        { order_id: body.razorpay_order_id, payment_id: body.razorpay_payment_id },
        body.razorpay_signature,
        secret
    );

    if (xx) {
        console.log("✅ Payment Verification Successful");

        // Update payment status
        const updatedPayment = await Payment.findOneAndUpdate(
            { oid: body.razorpay_order_id },
            { done: "true" },
            { new: true }
        );

        console.log("✅ Payment Updated Successfully:", updatedPayment);

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/${updatedPayment.to_user}?paymentdone=true`);
    } else {
        console.log("❌ Payment Verification Failed. Debug Info:", {
            order_id: body.razorpay_order_id,
            payment_id: body.razorpay_payment_id,
            signature: body.razorpay_signature,
            secret,
        });
        return NextResponse.json({ success: false, message: "Payment Verification Failed" });
    }
};
