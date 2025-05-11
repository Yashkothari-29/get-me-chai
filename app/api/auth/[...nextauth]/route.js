import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import mongoose from "mongoose";
import User from '@/models/User'
import connectDB from '@/db/connectDb'

console.log("MONGODB_URI:", process.env.MONGODB_URI);

export const authoptions = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
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
