exports.handler = async (event, context) => {
  try {
    const { email, password } = JSON.parse(event.body);
    
    // Simple mock authentication
    if (email === 'sunriderental21@gmail.com' && password === 'sunriderental21') {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          message: 'Login successful',
          token: 'mock-admin-token',
          admin: {
            id: 'admin-1',
            name: 'Admin',
            email: 'sunriderental21@gmail.com'
          }
        }, null, 2),
      };
    }
    
    return {
      statusCode: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Invalid credentials'
      }, null, 2),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Internal server error'
      }, null, 2),
    };
  }
};
