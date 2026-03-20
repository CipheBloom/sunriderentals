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

const RiderApplication = mongoose.model('RiderApplication', RiderApplicationSchema);

exports.handler = async (event, context) => {
  try {
    await connectDB();
    
    const applications = await RiderApplication.find().lean();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(applications, null, 2),
    };
  } catch (error) {
    console.error('❌ Error in rider-applications function:', error);
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
