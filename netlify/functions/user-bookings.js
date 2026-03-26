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
    
    // Extract userId from path - try multiple methods
    let userId = null;
    
    // Method 1: From path parameters (Netlify)
    if (event.pathParameters && event.pathParameters.userId) {
      userId = event.pathParameters.userId;
    }
    
    // Method 2: From path (parse manually)
    if (!userId && event.path) {
      const pathParts = event.path.split('/');
      userId = pathParts[pathParts.length - 1];
    }
    
    // Method 3: From query string
    if (!userId && event.queryStringParameters && event.queryStringParameters.userId) {
      userId = event.queryStringParameters.userId;
    }
    
    console.log('🔍 User ID extracted:', userId);
    console.log('🔍 Event path:', event.path);
    
    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'User ID is required' }),
      };
    }
    
    console.log('🔍 Querying bookings for userId:', userId);
    const bookings = await Booking.find({ userId: userId }).lean();
    console.log('🔍 Found bookings count:', bookings.length);
    console.log('🔍 Full event path:', event.path);
    console.log('🔍 Path parameters:', event.pathParameters);
    
    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'User ID is required' }),
      };
    }
    
    if (!dbConnected) {
      // Return sample bookings for demonstration based on userId
      let userBookings = [];
      
      if (userId === 'google_123456') {
        userBookings = [
          {
            id: 'booking_001',
            userId: 'google_123456',
            userName: 'John Doe',
            userEmail: 'john.doe@example.com',
            userPhone: '+91 98765 43210',
            vehicleId: 'scooty-001',
            vehicleName: 'Honda Activa 6G',
            startDate: new Date('2024-03-25'),
            endDate: new Date('2024-03-27'),
            totalPrice: 1140,
            status: 'confirmed',
            createdAt: new Date('2024-03-20T10:30:00Z')
          }
        ];
      } else if (userId === 'google_789012') {
        userBookings = [
          {
            id: 'booking_002',
            userId: 'google_789012',
            userName: 'Jane Smith',
            userEmail: 'jane.smith@example.com',
            userPhone: '+91 87654 32109',
            vehicleId: 'scooty-002',
            vehicleName: 'TVS Jupiter',
            startDate: new Date('2024-03-22'),
            endDate: new Date('2024-03-24'),
            totalPrice: 1140,
            status: 'pending',
            createdAt: new Date('2024-03-20T14:15:00Z')
          }
        ];
      } else if (userId === 'google_345678') {
        userBookings = [
          {
            id: 'booking_003',
            userId: 'google_345678',
            userName: 'Mike Johnson',
            userEmail: 'mike.j@example.com',
            userPhone: '+91 76543 21098',
            vehicleId: 'bike-001',
            vehicleName: 'Royal Enfield Classic 350',
            startDate: new Date('2024-03-21'),
            endDate: new Date('2024-03-23'),
            totalPrice: 2280,
            status: 'completed',
            createdAt: new Date('2024-03-19T09:45:00Z')
          }
        ];
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(userBookings, null, 2),
      };
    }
    
    // Get bookings for specific user from MongoDB
    console.log('🔍 Querying bookings for userId:', userId);
    const bookings = await Booking.find({ userId: userId }).lean();
    
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
