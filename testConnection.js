const mongoose = require("mongoose");

const testDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/chai", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    const User = mongoose.model("User", new mongoose.Schema({
      name: String,
      email: String,
    }));

    const testUser = new User({ name: "Test User", email: "test@example.com" });
    await testUser.save();

    console.log("Test user inserted successfully.");
    process.exit();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

testDB();
