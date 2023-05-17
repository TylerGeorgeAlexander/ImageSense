// lib/connectDB.js
import mongoose from 'mongoose';

const connection = {};

async function connectDB() {
  if (connection.isConnected) {
    // Use existing database connection
    return;
  }
  // Use new database connection
  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  connection.isConnected = db.connections[0].readyState;
}

export default connectDB;
