import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/db/connectDb';
import { sendEmail } from '@/actions/sendEmail';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export const POST = async (req) => {
  await connectDB();
  try {
    const { email, password, username } = await req.json();
    if (!email || !password || !username) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }
    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    // Create user
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
    });
    // Send verification email
    const verifyUrl = `${process.env.NEXT_PUBLIC_URL}/api/verify?token=${verificationToken}&email=${encodeURIComponent(email)}`;
    await sendEmail({
      to: email,
      subject: 'Verify your email',
      html: `<p>Click the link to verify your email: <a href="${verifyUrl}">${verifyUrl}</a></p>`
    });
    return NextResponse.json({ success: true, message: 'Registration successful. Please check your email to verify your account.' });
  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json({ success: false, message: 'Registration failed', error: err.message }, { status: 500 });
  }
}; 