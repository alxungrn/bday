const { neon } = require('@neondatabase/serverless');

exports.handler = async () => {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL_UNPOOLED);
    
    const bingo = await sql`
      SELECT cell_index, bingo_text, checked
      FROM bingo
      ORDER BY cell_index
    `;
    
    return {
      statusCode: 200,
      body: JSON.stringify(bingo)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to load bingo' })
    };
  }
};