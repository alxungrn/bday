import { neon } from '@neondatabase/serverless';

export async function onRequest(context) {
  try {
    // In Cloudflare, secrets are accessed via context.env
    const sql = neon(context.env.DATABASE_URL);
    
    const rsvps = await sql`
      SELECT name, coming, drinks, timestamp
      FROM rsvp
      ORDER BY timestamp DESC
    `;
    
    return new Response(JSON.stringify(rsvps), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to load RSVPs' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
