const mongoose = require('mongoose');

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI not set');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// Schemas
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
  status: String,
  createdAt: Date,
});

const Booking = mongoose.model('Booking', BookingSchema);

exports.handler = async (event, context) => {
  try {
    await connectDB();
    
    const bookings = await Booking.find().lean();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(bookings, null, 2),
    };
  } catch (error) {
    console.error('❌ Error in bookings function:', error);
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
