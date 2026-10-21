// Netlify Serverless Function: /api/config
// Discovers Supabase environment variables on Netlify

exports.handler = async (event, context) => {
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify({
      supabaseUrl,
      supabaseAnonKey,
      hasSupabase: Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('YOUR_PROJECT_REF'))
    })
  };
};
