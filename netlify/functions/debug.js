exports.handler = async (event, context) => {
  console.log('Event received:', JSON.stringify(event, null, 2));
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ 
      message: 'Debug test working',
      path: event.path,
      method: event.httpMethod,
      body: event.body
    }, null, 2),
  };
};
