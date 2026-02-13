import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
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
        const { is_available } = body;
        const medicineId = params.id;

        // Verify ownership
        const medicine = db.prepare('SELECT * FROM medicines WHERE id = ? AND pharmacy_id = ?').get(medicineId, pharmacy.id);
        if (!medicine) {
            return NextResponse.json({ error: 'Medicine not found or access denied' }, { status: 404 });
        }

        const update = db.prepare('UPDATE medicines SET is_available = ? WHERE id = ?');
        update.run(is_available ? 1 : 0, medicineId);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Update medicine error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
