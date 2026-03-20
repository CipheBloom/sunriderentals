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
    
    // Parse path parameters
    const pathParts = event.path.split('/');
    const vehicleId = pathParts[pathParts.length - 1];
    const action = pathParts[pathParts.length - 2];
    
    if (event.httpMethod === 'PUT' && action === 'availability') {
      const { available } = JSON.parse(event.body);
      await Vehicle.updateOne({ id: vehicleId }, { available });
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ message: 'Vehicle availability updated' }),
      };
    }
    
    if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body);
      const newVehicle = new Vehicle(data);
      await newVehicle.save();
      
      return {
        statusCode: 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(newVehicle, null, 2),
      };
    }
    
    if (event.httpMethod === 'DELETE') {
      await Vehicle.deleteOne({ id: vehicleId });
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ message: 'Vehicle deleted' }),
      };
    }
    
    if (event.httpMethod === 'PUT') {
      const data = JSON.parse(event.body);
      await Vehicle.updateOne({ id: vehicleId }, data);
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ message: 'Vehicle updated' }),
      };
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
    console.error('❌ Error in vehicle operations function:', error);
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
