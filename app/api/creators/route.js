import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/db/connectDb';

export const GET = async () => {
  await connectDB();
  try {
    const users = await User.find({}, 'username name profilepic').lean();
    return NextResponse.json({ users });
  } catch (err) {
    return NextResponse.json({ users: [], error: err.message }, { status: 500 });
  }
}; 