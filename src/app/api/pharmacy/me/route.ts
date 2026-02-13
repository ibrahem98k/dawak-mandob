import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: any) {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'pharmacy-owner') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pharmacy = db.prepare('SELECT * FROM pharmacies WHERE user_id = ?').get(user.userId);

    if (!pharmacy) {
        return NextResponse.json({ error: 'Pharmacy not found' }, { status: 404 });
    }

    return NextResponse.json({ pharmacy });
}

export async function PUT(req: any) {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'pharmacy-owner') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, address, phone, lat, lng } = body;

        const update = db.prepare(`
      UPDATE pharmacies 
      SET name = COALESCE(?, name), 
          address = COALESCE(?, address), 
          phone = COALESCE(?, phone),
          lat = COALESCE(?, lat),
          lng = COALESCE(?, lng)
      WHERE user_id = ?
    `);

        const result = update.run(name, address, phone, lat, lng, user.userId);

        if (result.changes === 0) {
            return NextResponse.json({ error: 'Pharmacy not found or no changes made' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Update pharmacy error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
