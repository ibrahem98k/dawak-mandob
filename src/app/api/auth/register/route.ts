import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signJWT } from '@/lib/auth';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, role, name, address, lat, lng, phone } = body;

        if (!email || !password || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!['customer', 'pharmacy-owner'].includes(role)) {
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
        }

        // Check if user exists
        const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Transaction for atomic inserts
        const insertUser = db.prepare('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)');

        let userId;

        // Use transaction
        const createUserTransaction = db.transaction(() => {
            const result = insertUser.run(email, hashedPassword, role);
            userId = result.lastInsertRowid;

            if (role === 'pharmacy-owner') {
                if (!name || !address || !phone) {
                    throw new Error('Missing pharmacy details');
                }
                // lat/lng are optional initially or required? Let's say optional for now but valid if provided
                const insertPharmacy = db.prepare('INSERT INTO pharmacies (user_id, name, address, lat, lng, phone) VALUES (?, ?, ?, ?, ?, ?)');
                insertPharmacy.run(userId, name, address, lat || null, lng || null, phone);
            }
        });

        try {
            createUserTransaction();
        } catch (e: any) {
            return NextResponse.json({ error: e.message }, { status: 400 });
        }

        // Create JWT
        const token = await signJWT({ userId, email, role });

        const response = NextResponse.json({ success: true, user: { id: userId, email, role } });
        response.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });

        return response;

    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
