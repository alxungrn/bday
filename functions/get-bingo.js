import { neon } from '@neondatabase/serverless';

export async function onRequest(context) {
  try {
    const sql = neon(context.env.NETLIFY_DATABASE_URL_UNPOOLED);
    
    const bingo = await sql`
      SELECT cell_index, bingo_text, checked
      FROM bingo
      ORDER BY cell_index
    `;
    
    return new Response(JSON.stringify(bingo), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error loading bingo:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to load bingo',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}