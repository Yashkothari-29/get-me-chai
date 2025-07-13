import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("❌ MONGODB_URI is not defined in environment variables.");
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: "getmeachai", // 👈 Optional, but good to ensure the DB is set
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
