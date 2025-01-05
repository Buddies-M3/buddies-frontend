import { NextResponse } from 'next/server';

import pool from 'utils/db';

// Fetch all API keys
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ownerId = searchParams.get('ownerId');

  if (!ownerId) {
    return NextResponse.json({ error: 'ownerId is required' }, { status: 400 });
  }

  try {
    const [rows] = await pool.query(
      'SELECT id, name, SUBSTRING(api_key, 1, 4) AS api_key_start, SUBSTRING(api_key, -4) AS api_key_end, created_at, expiry, permissions FROM `api_keys` WHERE user_id = ?',
      [ownerId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'No API keys found for this owner' }, { status: 404 });
    }

    const maskedKeys = rows.map((key) => ({
      ...key,
      api_key: `${key.api_key_start}...${key.api_key_end}`
    }));

    return NextResponse.json(maskedKeys);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Create a new API key
export async function POST(request) {

  const { name, expiry, api_key, ownerId } = await request.json();
  console.log(name, expiry, api_key, ownerId);

  try {
    const [result] = await pool.query(
      'INSERT INTO `api_keys` (name, api_key, expiry, user_id) VALUES (?, ?, ?, ?)',
      [name, api_key, expiry === '' ? null : expiry, ownerId]
    );
    const insertedId = result.insertId;
    const [insertedRow] = await pool.query('SELECT * FROM `api_keys` WHERE id = ?', [insertedId]);

    return NextResponse.json({ data: insertedRow[0] }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Update an API key
export async function PUT(request) {
  const { id, name, api_key, expiry, permissions } = await request.json();
  try {
    const [result] = await pool.query(
      'UPDATE `api_keys` SET name = ?, api_key = ?, expiry = ?, permissions = ? WHERE id = ?',
      [name, api_key, expiry, permissions.join(', '), id]
    );
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'API key updated successfully' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Delete an API key
export async function DELETE(request) {
  const { id } = await request.json();
  try {
    const [result] = await pool.query('DELETE FROM `api_keys` WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'API key deleted successfully' }); // 204 No Content
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}