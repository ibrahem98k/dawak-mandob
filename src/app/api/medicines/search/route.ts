import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!name) {
        return NextResponse.json({ error: 'Medicine name is required' }, { status: 400 });
    }

    try {
        const medicines = db.prepare(`
      SELECT m.*, p.name as pharmacy_name, p.address, p.lat, p.lng, p.phone
      FROM medicines m
      JOIN pharmacies p ON m.pharmacy_id = p.id
      WHERE m.name LIKE ? AND m.is_available = 1
    `).all(`%${name}%`) as any[];

        if (lat && lng) {
            const userLat = parseFloat(lat);
            const userLng = parseFloat(lng);

            const medicinesWithDistance = medicines.map((m) => {
                const distance = calculateDistance(userLat, userLng, m.lat, m.lng);
                return { ...m, distance };
            });

            medicinesWithDistance.sort((a, b) => a.distance - b.distance);

            return NextResponse.json({ medicines: medicinesWithDistance.slice(0, 3) });
        }

        return NextResponse.json({ medicines: medicines.slice(0, 3) });
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
