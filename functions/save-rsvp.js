import { neon } from '@neondatabase/serverless';

export async function onRequest(context) {
  if (context.request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { name, coming, drinks } = await context.request.json();
    const sql = neon(context.env.NETLIFY_DATABASE_URL_UNPOOLED);
    
    await sql`
      INSERT INTO rsvp (name, coming, drinks)
      VALUES (${name}, ${coming}, ${drinks})
    `;
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to save RSVP' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}