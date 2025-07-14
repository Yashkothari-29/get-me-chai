import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/db/connectDb';

export const GET = async (req) => {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    if (!token || !email) {
      return NextResponse.json({ success: false, message: 'Missing token or email' }, { status: 400 });
    }
    const user = await User.findOne({ email, verificationToken: token });
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid token or email' }, { status: 400 });
    }
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();
    return NextResponse.json({ success: true, message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    console.error('Email verification error:', err);
    return NextResponse.json({ success: false, message: 'Verification failed', error: err.message }, { status: 500 });
  }
}; 