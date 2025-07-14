import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/db/connectDb';
import bcrypt from 'bcryptjs';

export const POST = async (req) => {
  await connectDB();
  try {
    const { email, token, password } = await req.json();
    if (!email || !token || !password) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }
    const user = await User.findOne({ email, passwordResetToken: token });
    if (!user || !user.passwordResetExpires || user.passwordResetExpires < Date.now()) {
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 400 });
    }
    user.password = await bcrypt.hash(password, 10);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();
    return NextResponse.json({ success: true, message: 'Password reset successful. You can now log in.' });
  } catch (err) {
    console.error('Password reset error:', err);
    return NextResponse.json({ success: false, message: 'Password reset failed', error: err.message }, { status: 500 });
  }
}; 