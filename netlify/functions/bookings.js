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
    
    // Handle POST request - Create new booking
    if (event.httpMethod === 'POST') {
      const bookingData = JSON.parse(event.body);
      
      if (!dbConnected) {
        // Return mock response if MongoDB not connected
        console.log('📝 Creating booking (mock - no MongoDB)');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            ...bookingData,
            id: bookingData.id || `booking_${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: 'pending'
          }, null, 2),
        };
      }
      
      // Create booking in MongoDB
      const booking = new Booking({
        ...bookingData,
        createdAt: new Date(),
      });
      
      await booking.save();
      console.log('✅ Booking created in MongoDB:', booking.id);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(booking.toObject(), null, 2),
      };
    }
    
    // Handle GET request - Get all bookings
    if (event.httpMethod === 'GET') {
      if (!dbConnected) {
        // Return sample booking data for demonstration
        const sampleBookings = [
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
          },
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
          },
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
          },
          {
            id: 'booking_004',
            userId: 'google_901234',
            userName: 'Sarah Williams',
            userEmail: 'sarah.w@example.com',
            userPhone: '+91 65432 10987',
            vehicleId: 'scooty-003',
            vehicleName: 'Honda Dio',
            startDate: new Date('2024-03-26'),
            endDate: new Date('2024-03-28'),
            totalPrice: 1140,
            status: 'cancelled',
            createdAt: new Date('2024-03-18T16:20:00Z')
          }
        ];
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(sampleBookings, null, 2),
        };
      }
      
      const bookings = await Booking.find().lean();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(bookings, null, 2),
      };
    }
    
    // Handle unsupported methods
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
    
  } catch (error) {
    console.error('❌ Error in bookings function:', error);
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
