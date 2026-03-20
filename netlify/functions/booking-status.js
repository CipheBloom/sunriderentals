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
    
    // Extract bookingId from path
    let bookingId = null;
    
    // Method 1: From path parameters (Netlify)
    if (event.pathParameters && event.pathParameters.bookingId) {
      bookingId = event.pathParameters.bookingId;
    }
    
    // Method 2: From path (parse manually)
    if (!bookingId && event.path) {
      const pathParts = event.path.split('/');
      // Handle /bookings/{id}/status
      const statusIndex = pathParts.indexOf('status');
      if (statusIndex > 0) {
        bookingId = pathParts[statusIndex - 1];
      } else {
        bookingId = pathParts[pathParts.length - 1];
      }
    }
    
    console.log('🔍 Booking ID extracted:', bookingId);
    console.log('🔍 Full event path:', event.path);
    console.log('🔍 Path parameters:', event.pathParameters);
    
    if (!bookingId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Booking ID is required' }),
      };
    }
    
    // Handle PUT request - Update booking status
    if (event.httpMethod === 'PUT') {
      const { status } = JSON.parse(event.body);
      
      if (!dbConnected) {
        // Return mock response if MongoDB not connected
        console.log('📝 Updating booking status (mock - no MongoDB)');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            id: bookingId,
            status: status,
            updatedAt: new Date().toISOString(),
            message: `Booking status updated to ${status} (mock)`
          }, null, 2),
        };
      }
      
      // Update booking status in MongoDB
      const booking = await Booking.findOneAndUpdate(
        { id: bookingId },
        { status, updatedAt: new Date() },
        { new: true, upsert: false }
      );
      
      if (!booking) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Booking not found' }),
        };
      }
      
      console.log('✅ Booking status updated in MongoDB:', booking.id, '→', status);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(booking.toObject(), null, 2),
      };
    }
    
    // Handle GET request - Get single booking
    if (event.httpMethod === 'GET') {
      if (!dbConnected) {
        // Return mock booking for demonstration
        const mockBooking = {
          id: bookingId,
          userId: 'google_123456',
          userName: 'John Doe',
          userEmail: 'john.doe@example.com',
          userPhone: '+91 98765 43210',
          vehicleId: 'scooty-001',
          vehicleName: 'Honda Activa 6G',
          startDate: new Date('2024-03-25'),
          endDate: new Date('2024-03-27'),
          totalPrice: 1140,
          status: 'pending',
          createdAt: new Date('2024-03-20T10:30:00Z')
        };
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(mockBooking, null, 2),
        };
      }
      
      // Get booking from MongoDB
      const booking = await Booking.findOne({ id: bookingId }).lean();
      
      if (!booking) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Booking not found' }),
        };
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(booking, null, 2),
      };
    }
    
    // Handle unsupported methods
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
    
  } catch (error) {
    console.error('❌ Error in booking status function:', error);
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
