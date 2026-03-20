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
    // Return sample rider application data for demonstration
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
