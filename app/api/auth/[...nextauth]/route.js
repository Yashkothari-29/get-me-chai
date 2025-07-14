import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import mongoose from "mongoose";
import User from '@/models/User'
import connectDB from '@/db/connectDb'
import bcrypt from 'bcryptjs';

console.log("MONGODB_URI:", process.env.MONGODB_URI);

export const authoptions = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials.email }).select('+password');
        if (!user) {
          throw new Error('No user found with this email');
        }
        if (!user.isVerified) {
          throw new Error('Please verify your email before logging in.');
        }
        if (!user.password) {
          throw new Error('No password set for this user.');
        }
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Invalid password');
        }
        return { id: user._id, email: user.email, name: user.username };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "github") {
        // ✅ Connect to the database before querying
        await connectDB();

        try {
          // ✅ Fix email reference
          const currentUser = await User.findOne({ email: user.email });

          if (!currentUser) {
            // ✅ Prevent error if email is undefined
            const newUser = new User({
              email: user.email,
              username: user.email ? user.email.split('@')[0] : "unknown_user",
            });
            await newUser.save();
          } else {
            user.name = currentUser.username;
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return true;
    },

    async session({ session }) {
      // ✅ Connect to database before querying
      await connectDB();

      try {
        const dbUser = await User.findOne({ email: session.user.email });
        if (dbUser) {
          session.user.name = dbUser.username;
        }
      } catch (error) {
        console.error("Error in session callback:", error);
      }
      session.user.username = session.user.name;

      return session;
    }
  }
});

export { authoptions as GET, authoptions as POST };
