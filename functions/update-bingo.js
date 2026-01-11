import { neon } from '@neondatabase/serverless';

export async function onRequest(context) {
  // Handle CORS preflight
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  if (context.request.method !== 'POST') {
    return new Response('Method Not Allowed', { 
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { cellIndex, checked } = await context.request.json();
    
    // Validate inputs
    if (cellIndex === undefined || checked === undefined) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: cellIndex and checked' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const sql = neon(context.env.NETLIFY_DATABASE_URL_UNPOOLED);
    
    await sql`
      UPDATE bingo
      SET checked = ${checked}
      WHERE cell_index = ${cellIndex}
    `;
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error updating bingo:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to update bingo',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}