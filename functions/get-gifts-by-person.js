const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
  try {
    const person = event.queryStringParameters?.person;

    if (!person) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Person parameter required' })
      };
    }

    const sql = neon(process.env.NETLIFY_DATABASE_URL_UNPOOLED);

    const gifts = await sql`
      SELECT gift_name, description, link
      FROM gifts
      WHERE person = ${person}
      ORDER BY display_order
    `;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
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
