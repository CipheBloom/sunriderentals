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

// Rider Application Schema
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
  status: { type: String, default: 'pending' },
  adminNotes: String,
  createdAt: { type: Date, default: Date.now },
});

// User Schema for updating rider status
const UserSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  phone: String,
  picture: String,
  isRider: { type: Boolean, default: false },
  address: String,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);
const RiderApplication = mongoose.model('RiderApplication', RiderApplicationSchema);

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
    
    // Extract applicationId from path
    let applicationId = null;
    
    // Method 1: From path parameters (Netlify)
    if (event.pathParameters && event.pathParameters.applicationId) {
      applicationId = event.pathParameters.applicationId;
    }
    
    // Method 2: From path (parse manually)
    if (!applicationId && event.path) {
      const pathParts = event.path.split('/');
      // Handle /rider-applications/{id}/status
      const statusIndex = pathParts.indexOf('status');
      if (statusIndex > 0) {
        applicationId = pathParts[statusIndex - 1];
      } else {
        applicationId = pathParts[pathParts.length - 1];
      }
    }
    
    console.log('🔍 Rider Application ID extracted:', applicationId);
    console.log('🔍 Full event path:', event.path);
    console.log('🔍 Path parameters:', event.pathParameters);
    
    if (!applicationId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Rider Application ID is required' }),
      };
    }
    
    // Handle PUT request - Update rider application status
    if (event.httpMethod === 'PUT') {
      const { status, adminNotes } = JSON.parse(event.body);
      
      if (!dbConnected) {
        // Return mock response if MongoDB not connected
        console.log('📝 Updating rider application status (mock - no MongoDB)');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            id: applicationId,
            status: status,
            adminNotes: adminNotes || '',
            updatedAt: new Date().toISOString(),
            message: `Rider application status updated to ${status} (mock)`
          }, null, 2),
        };
      }
      
      // Update rider application status in MongoDB
      const application = await RiderApplication.findOneAndUpdate(
        { id: applicationId },
        { status, adminNotes: adminNotes || '', updatedAt: new Date() },
        { new: true, upsert: false }
      );
      
      if (!application) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Rider application not found' }),
        };
      }
      
      console.log('✅ Rider application status updated in MongoDB:', application.id, '→', status);
      
      // If application is approved, update user's rider status
      if (status === 'approved' && application.userId) {
        try {
          const userUpdate = await User.findOneAndUpdate(
            { id: application.userId },
            { isRider: true, updatedAt: new Date() },
            { new: true, upsert: false }
          );
          
          if (userUpdate) {
            console.log('✅ User rider status updated to true for:', application.userId);
          } else {
            console.log('⚠️ User not found for rider status update:', application.userId);
          }
        } catch (userError) {
          console.error('❌ Error updating user rider status:', userError);
          // Don't fail the whole operation if user update fails
        }
      }
      
      // If application is rejected, ensure user rider status is false
      if (status === 'rejected' && application.userId) {
        try {
          const userUpdate = await User.findOneAndUpdate(
            { id: application.userId },
            { isRider: false, updatedAt: new Date() },
            { new: true, upsert: false }
          );
          
          if (userUpdate) {
            console.log('✅ User rider status updated to false for:', application.userId);
          }
        } catch (userError) {
          console.error('❌ Error updating user rider status:', userError);
          // Don't fail the whole operation if user update fails
        }
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(application.toObject(), null, 2),
      };
    }
    
    // Handle GET request - Get single rider application
    if (event.httpMethod === 'GET') {
      if (!dbConnected) {
        // Return mock rider application for demonstration
        const mockApplication = {
          id: applicationId,
          userId: 'google_789012',
          userName: 'Jane Smith',
          userEmail: 'jane.smith@example.com',
          userPhone: '+91 87654 32109',
          aadharNumber: '123456789012',
          panNumber: 'ABCDE1234F',
          fullName: 'Jane Smith',
          age: 28,
          city: 'Bangalore',
          vehicleType: 'scooter',
          hasLicense: true,
          licenseNumber: 'KA-01-2023-0012345',
          experience: '2-3 years',
          preferredWorkArea: 'Electronic City, Whitefield',
          availability: 'full-time',
          additionalInfo: 'Looking for delivery partner role',
          status: 'pending',
          adminNotes: '',
          createdAt: new Date('2024-03-18T11:30:00Z')
        };
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(mockApplication, null, 2),
        };
      }
      
      // Get rider application from MongoDB
      const application = await RiderApplication.findOne({ id: applicationId }).lean();
      
      if (!application) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Rider application not found' }),
        };
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(application, null, 2),
      };
    }
    
    // Handle unsupported methods
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
    
  } catch (error) {
    console.error('❌ Error in rider application status function:', error);
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
