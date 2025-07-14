import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/db/connectDb';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authoptions } from '../auth/[...nextauth]/route';

export const POST = async (req) => {
  await connectDB();
  try {
    const session = await getServerSession(authoptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }
    const { password } = await req.json();
    if (!password) {
      return NextResponse.json({ success: false, message: 'Password is required' }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { password: hashedPassword } },
      { new: true }
    );
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Password set/changed successfully.' });
  } catch (err) {
    console.error('Set password error:', err);
    return NextResponse.json({ success: false, message: 'Failed to set password', error: err.message }, { status: 500 });
  }
}; 