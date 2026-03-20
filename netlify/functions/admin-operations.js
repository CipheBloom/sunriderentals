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

const UserSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  phone: String,
  isRider: Boolean,
  createdAt: Date,
});

const Booking = mongoose.model('Booking', BookingSchema);
const RiderApplication = mongoose.model('RiderApplication', RiderApplicationSchema);
const User = mongoose.model('User', UserSchema);

exports.handler = async (event, context) => {
  try {
    await connectDB();
    
    // Parse path parameters
    const pathParts = event.path.split('/');
    const id = pathParts[pathParts.length - 1];
    const resource = pathParts[pathParts.length - 3];
    const action = pathParts[pathParts.length - 2];
    
    if (resource === 'bookings') {
      if (event.httpMethod === 'PUT' && action === 'status') {
        const { status } = JSON.parse(event.body);
        await Booking.updateOne({ id }, { status });
        
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ message: 'Booking status updated' }),
        };
      }
      
      if (event.httpMethod === 'DELETE') {
        await Booking.deleteOne({ id });
        
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ message: 'Booking deleted' }),
        };
      }
    }
    
    if (resource === 'rider-applications') {
      if (event.httpMethod === 'PUT' && action === 'status') {
        const { status, adminNotes } = JSON.parse(event.body);
        
        // Update application status
        await RiderApplication.updateOne({ id }, { status, adminNotes });
        
        // If approved, update user rider status
        if (status === 'approved') {
          const application = await RiderApplication.findOne({ id });
          if (application) {
            await User.updateOne({ id: application.userId }, { isRider: true });
          }
        }
        
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ message: 'Application status updated' }),
        };
      }
      
      if (event.httpMethod === 'DELETE') {
        await RiderApplication.deleteOne({ id });
        
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ message: 'Application deleted' }),
        };
      }
    }
    
    if (resource === 'users') {
      if (event.httpMethod === 'PUT' && action === 'rider-status') {
        const { isRider } = JSON.parse(event.body);
        await User.updateOne({ id }, { isRider });
        
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ message: 'User rider status updated' }),
        };
      }
    }
    
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('❌ Error in admin operations function:', error);
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
