const { neon } = require('@neondatabase/serverless');

exports.handler = async () => {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL_UNPOOLED);
    
    const rsvps = await sql`
      SELECT name, coming, drinks, timestamp
      FROM rsvp
      ORDER BY timestamp DESC
    `;
    
    return {
      statusCode: 200,
      body: JSON.stringify(rsvps)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to load RSVPs' })
    };
  }
};