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

// Booking Schema
const BookingSchema = new mongoose.Schema({
  id: String,
  userId: String,
  userName: String,
  userEmail: String,
  userPhone: String,
  vehicleId: String,
  vehicleName: String,
  startDate: Date,
  endDate: Date,
  totalPrice: Number,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model('Booking', BookingSchema);

exports.handler = async (event, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };
  
  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }
  
  try {
    const dbConnected = await connectDB();
    
    // Extract userId from path parameters
    const userId = event.pathParameters?.userId;
    
    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'User ID is required' }),
      };
    }
    
    if (!dbConnected) {
      // Return empty array if MongoDB not connected
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify([], null, 2),
      };
    }
    
    // Get bookings for specific user
    const bookings = await Booking.find({ userId }).lean();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(bookings, null, 2),
    };
    
  } catch (error) {
    console.error('❌ Error in user bookings function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        stack: error.stack 
      }),
    };
  }
};
