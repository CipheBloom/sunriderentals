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
    
    // Handle PUT request - Update rider application
    if (event.httpMethod === 'PUT') {
      const applicationData = JSON.parse(event.body);
      
      if (!dbConnected) {
        // Return mock response if MongoDB not connected
        console.log('📝 Updating rider application (mock - no MongoDB)');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            ...applicationData,
            updatedAt: new Date().toISOString()
          }, null, 2),
        };
      }
      
      // Update rider application in MongoDB
      const application = await RiderApplication.findOneAndUpdate(
        { id: applicationData.id },
        applicationData,
        { new: true, upsert: false }
      );
      
      if (!application) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Rider application not found' }),
        };
      }
      
      console.log('✅ Rider application updated in MongoDB:', application.id);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(application.toObject(), null, 2),
      };
    }
    
    // Handle DELETE request - Delete rider application
    if (event.httpMethod === 'DELETE') {
      const applicationId = event.pathParameters?.applicationId || 
                          event.path?.split('/').pop();
      
      if (!dbConnected) {
        // Return mock response if MongoDB not connected
        console.log('📝 Deleting rider application (mock - no MongoDB)');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            message: 'Rider application deleted successfully (mock)',
            id: applicationId
          }, null, 2),
        };
      }
      
      // Delete rider application from MongoDB
      const result = await RiderApplication.deleteOne({ id: applicationId });
      
      if (result.deletedCount === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Rider application not found' }),
        };
      }
      
      console.log('✅ Rider application deleted from MongoDB:', applicationId);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'Rider application deleted successfully',
          id: applicationId
        }, null, 2),
      };
    }
    
    // Handle GET request - Get all rider applications or single by userId
    if (event.httpMethod === 'GET') {
      // Check if userId query parameter is provided
      const userId = event.queryStringParameters?.userId;
      
      if (userId) {
        // Fetch single application for specific user
        console.log(`🔍 Fetching rider application for user: ${userId}`);
        
        if (!dbConnected) {
          console.log('🔍 Using mock rider application data - MongoDB not connected');
          // Return no application found for this user
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'No rider application found for this user' }),
          };
        }
        
        // Find application by userId
        const application = await RiderApplication.findOne({ userId }).lean();
        
        if (!application) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'No rider application found for this user' }),
          };
        }
        
        // Ensure id field exists
        const appWithId = {
          ...application,
          id: application.id || application._id?.toString()
        };
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(appWithId, null, 2),
        };
      }
      
      // Otherwise return all applications (admin use)
      if (!dbConnected) {
        // Return sample rider application data only if MongoDB not connected
        console.log('📝 Returning sample rider applications (no MongoDB connection)');
        const sampleApplications = [
          {
            id: 'rider_app_001',
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
          },
          {
            id: 'rider_app_002',
            userId: 'google_901234',
            userName: 'Sarah Williams',
            userEmail: 'sarah.w@example.com',
            userPhone: '+91 65432 10987',
            aadharNumber: '987654321098',
            panNumber: 'XYZAB5678C',
            fullName: 'Sarah Williams',
            age: 32,
            city: 'Mumbai',
            vehicleType: 'bike',
            hasLicense: true,
            licenseNumber: 'MH-02-2022-0067890',
            experience: '4-5 years',
            preferredWorkArea: 'Andheri, Bandra, Juhu',
            availability: 'part-time',
            additionalInfo: 'Available weekends only',
            status: 'approved',
            adminNotes: 'Good experience, approved for part-time',
            createdAt: new Date('2024-03-16T14:45:00Z')
          },
          {
            id: 'rider_app_003',
            userId: 'google_567890',
            userName: 'Robert Brown',
            userEmail: 'robert.b@example.com',
            userPhone: '+91 54321 09876',
            aadharNumber: '456789012345',
            panNumber: 'LMNOP9012D',
            fullName: 'Robert Brown',
            age: 25,
            city: 'Delhi',
            vehicleType: 'scooter',
            hasLicense: false,
            licenseNumber: '',
            experience: '1-2 years',
            preferredWorkArea: 'Connaught Place, Karol Bagh',
            availability: 'full-time',
            additionalInfo: 'Learning to drive, will get license soon',
            status: 'rejected',
            adminNotes: 'Rejected - no driving license',
            createdAt: new Date('2024-03-14T09:15:00Z')
          }
        ];
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(sampleApplications, null, 2),
        };
      }
      
      // Get real rider applications from MongoDB
      console.log('🔍 Fetching real rider applications from MongoDB');
      const applications = await RiderApplication.find().lean();
      console.log(`✅ Found ${applications.length} rider applications in database`);
      
      // Ensure each application has an id field
      const applicationsWithId = applications.map(app => ({
        ...app,
        id: app.id || app._id?.toString() || `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }));
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(applicationsWithId, null, 2),
      };
    }
    
    // Handle POST request - Create new rider application
    if (event.httpMethod === 'POST') {
      const applicationData = JSON.parse(event.body);
      
      if (!dbConnected) {
        // Return mock response if MongoDB not connected
        console.log('📝 Creating rider application (mock - no MongoDB)');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            ...applicationData,
            id: applicationData.id || `rider_app_${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: 'pending'
          }, null, 2),
        };
      }
      
      // Create rider application in MongoDB
      const applicationId = applicationData.id || `rider_app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const application = new RiderApplication({
        ...applicationData,
        id: applicationId,
        createdAt: new Date(),
      });
      
      await application.save();
      console.log('✅ Rider application created in MongoDB:', application.id);
      
      // Ensure the returned object has the id field
      const appObj = application.toObject();
      appObj.id = appObj.id || applicationId;
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(application.toObject(), null, 2),
      };
    }
    
    // Handle DELETE request - Delete rider application
    if (event.httpMethod === 'DELETE') {
      const applicationId = event.pathParameters?.applicationId || 
                          event.path?.split('/').pop();
      
      if (!dbConnected) {
        // Return mock response if MongoDB not connected
        console.log('📝 Deleting rider application (mock - no MongoDB)');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            message: 'Rider application deleted successfully (mock)',
            id: applicationId
          }, null, 2),
        };
      }
      
      // Delete rider application from MongoDB
      const result = await RiderApplication.deleteOne({ id: applicationId });
      
      if (result.deletedCount === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Rider application not found' }),
        };
      }
      
      console.log('✅ Rider application deleted from MongoDB:', applicationId);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'Rider application deleted successfully',
          id: applicationId
        }, null, 2),
      };
    }
    
    // Handle unsupported methods
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
    
  } catch (error) {
    console.error('❌ Error in rider-applications function:', error);
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
