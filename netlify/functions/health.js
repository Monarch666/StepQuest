// Netlify Serverless Function: /api/health

exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      status: 'ok',
      app: 'StepQuest Web (Netlify Edge)',
      timestamp: new Date().toISOString()
    })
  };
};
