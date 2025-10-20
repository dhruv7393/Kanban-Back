const mongoose = require("mongoose");

const connectDB = async (mongourl) => {
  try {
    const conn = await mongoose.connect(mongourl);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
