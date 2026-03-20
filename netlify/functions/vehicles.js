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

const Vehicle = mongoose.model('Vehicle', VehicleSchema);

exports.handler = async (event, context) => {
  try {
    await connectDB();
    
    const vehicles = await Vehicle.find().lean();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(vehicles, null, 2),
    };
  } catch (error) {
    console.error('❌ Error in vehicles function:', error);
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
