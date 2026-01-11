import { neon } from '@neondatabase/serverless';

export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    const person = url.searchParams.get('person');
    
    if (!person) {
      return new Response(JSON.stringify({ error: 'Person parameter required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const sql = neon(context.env.NETLIFY_DATABASE_URL_UNPOOLED);
    
    const gifts = await sql`
      SELECT gift_name, description, link
      FROM gifts
      WHERE person = ${person}
      ORDER BY gift_name
    `;
    
    return new Response(JSON.stringify(gifts), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to load gifts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}