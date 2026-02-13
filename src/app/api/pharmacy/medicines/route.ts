import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: Request) {
    const user = await getUserFromRequest(req as any); // Cast for now or fix type
    if (!user || user.role !== 'pharmacy-owner') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pharmacy = db.prepare('SELECT id FROM pharmacies WHERE user_id = ?').get(user.userId) as any;
    if (!pharmacy) {
        return NextResponse.json({ error: 'Pharmacy profile not found' }, { status: 404 });
    }

    const medicines = db.prepare('SELECT * FROM medicines WHERE pharmacy_id = ?').all(pharmacy.id);

    return NextResponse.json({ medicines });
}

export async function POST(req: Request) {
    const user = await getUserFromRequest(req as any);
    if (!user || user.role !== 'pharmacy-owner') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pharmacy = db.prepare('SELECT id FROM pharmacies WHERE user_id = ?').get(user.userId) as any;
    if (!pharmacy) {
        return NextResponse.json({ error: 'Pharmacy profile not found' }, { status: 404 });
    }

    try {
        const body = await req.json();
        const { name, description, price, is_available } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const insert = db.prepare('INSERT INTO medicines (pharmacy_id, name, description, price, is_available) VALUES (?, ?, ?, ?, ?)');
        const result = insert.run(pharmacy.id, name, description, price, is_available ? 1 : 0);

        return NextResponse.json({ success: true, medicineId: result.lastInsertRowid });

    } catch (error) {
        console.error('Add medicine error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
