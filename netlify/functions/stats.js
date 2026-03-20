const mongoose = require('mongoose');

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI not set');
  return {
    statusCode: 500,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ error: 'MONGO_URI not configured' }),
  };
}

let isConnected = false;

const connectDB = async () => {
  if (!isConnected) {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log('✅ MongoDB Connected');
  }
};

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

const UserSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  phone: String,
  isRider: Boolean,
  createdAt: Date,
});

const VehicleSchema = new mongoose.Schema({
  id: String,
  name: String,
  category: String,
  pricePerDay: Number,
  image: String,
  description: String,
  features: [String],
  specs: {
    engine: String,
    power: String,
    mileage: String,
    fuelCapacity: String,
  },
  available: Boolean,
  riderPricePerDay: Number,
});

const RiderApplicationSchema = new mongoose.Schema({
  id: String,
  userId: String,
  userName: String,
  userEmail: String,
  userPhone: String,
  aadharNumber: String,
  panNumber: String,
  fullName: String,
  age: Number,
  city: String,
  vehicleType: String,
  hasLicense: Boolean,
  licenseNumber: String,
  experience: String,
  preferredWorkArea: String,
  availability: String,
  additionalInfo: String,
  status: String,
  adminNotes: String,
  createdAt: Date,
});

const Booking = mongoose.model('Booking', BookingSchema);
const User = mongoose.model('User', UserSchema);
const Vehicle = mongoose.model('Vehicle', VehicleSchema);
const RiderApplication = mongoose.model('RiderApplication', RiderApplicationSchema);

exports.handler = async (event, context) => {
  try {
    await connectDB();
    
    const [bookings, users, vehicles, riderApplications] = await Promise.all([
      Booking.find(),
      User.find(),
      Vehicle.find(),
      RiderApplication.find()
    ]);
    
    const stats = {
      totalBookings: bookings.length,
      totalUsers: users.length,
      totalVehicles: vehicles.length,
      totalRiderApplications: riderApplications.length,
      activeBookings: bookings.filter(b => b.status === 'active').length,
      completedBookings: bookings.filter(b => b.status === 'completed').length,
      cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
      pendingRiderApplications: riderApplications.filter(ra => ra.status === 'pending').length,
      approvedRiderApplications: riderApplications.filter(ra => ra.status === 'approved').length,
      rejectedRiderApplications: riderApplications.filter(ra => ra.status === 'rejected').length,
      availableVehicles: vehicles.filter(v => v.available).length,
      unavailableVehicles: vehicles.filter(v => !v.available).length,
      totalRiders: users.filter(u => u.isRider).length,
    };
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(stats, null, 2),
    };
  } catch (error) {
    console.error('❌ Error in stats function:', error);
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
