import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/db/connectDb';
import { sendEmail } from '@/actions/sendEmail';
import crypto from 'crypto';

export const POST = async (req) => {
  await connectDB();
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: 'No user found with that email' }, { status: 404 });
    }
    // Generate token and expiry (1 hour)
    const token = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = token;
    user.passwordResetExpires = Date.now() + 3600 * 1000;
    await user.save();
    // Send reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    await sendEmail({
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Click the link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`
    });
    return NextResponse.json({ success: true, message: 'Password reset email sent. Please check your inbox.' });
  } catch (err) {
    console.error('Password reset request error:', err);
    return NextResponse.json({ success: false, message: 'Password reset request failed', error: err.message }, { status: 500 });
  }
}; 