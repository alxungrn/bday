const { neon } = require('@neondatabase/serverless');

exports.handler = async () => {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL_UNPOOLED);
    
    const gifts = await sql`
      SELECT gift_name, description, link
      FROM gifts
      ORDER BY display_order
    `;
    
    return {
      statusCode: 200,
      body: JSON.stringify(gifts)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to load gifts' })
    };
  }
};