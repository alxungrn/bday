const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { name, coming, drinks } = JSON.parse(event.body);
    const sql = neon(process.env.NETLIFY_DATABASE_URL_UNPOOLED);
    
    await sql`
      INSERT INTO rsvp (name, coming, drinks)
      VALUES (${name}, ${coming}, ${drinks})
    `;
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save RSVP' })
    };
  }
};