import { neon } from '@neondatabase/serverless';

export async function onRequest(context) {
  try {
    // Get the person from the URL query parameters
    const { searchParams } = new URL(context.request.url);
    const person = searchParams.get('person');

    if (!person) {
      return new Response(JSON.stringify({ error: 'Person parameter required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Access the database secret via context.env
    const sql = neon(context.env.NETLIFY_DATABASE_URL_UNPOOLED);

    const gifts = await sql`
      SELECT gift_name, description, link
      FROM gifts
      WHERE person = ${person}
      ORDER BY display_order
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
