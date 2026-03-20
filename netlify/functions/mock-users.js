const mongoose = require('mongoose');

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

let isConnected = false;

const connectDB = async () => {
  if (!isConnected && MONGO_URI) {
    try {
      await mongoose.connect(MONGO_URI);
      isConnected = true;
      console.log('✅ MongoDB Connected');
    } catch (error) {
      console.error('❌ MongoDB Connection Error:', error);
      return false;
    }
  }
  return isConnected;
};

// Schemas
const UserSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  phone: String,
  isRider: Boolean,
  createdAt: Date,
});

const User = mongoose.model('User', UserSchema);

exports.handler = async (event, context) => {
  try {
    const dbConnected = await connectDB();
    
    if (!dbConnected) {
      // Return mock data if MongoDB is not connected
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify([], null, 2),
      };
    }
    
    const users = await User.find().lean();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(users, null, 2),
    };
  } catch (error) {
    console.error('❌ Error in users function:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: error.message,
        stack: error.stack 
      }),
    };
  }
};
