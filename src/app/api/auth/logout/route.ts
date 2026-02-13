import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.redirect(new URL('/', 'http://localhost:3000')); // Redirect to home
    // In production, use process.env.NEXT_PUBLIC_URL or relative path if possible, but redirect needs absolute URL if using new URL() constructor or just string path.
    // Actually NextResponse.redirect needs an absolute URL.
    // Better to just return success and let client handle redirect, or server action style.
    // But since I used <form action="...">, the browser expects a navigation or a reload.

    // Let's rely on relative redirect which might work or construct absolute url.
    // Safe bet: use relative path string if Next supports it (it usually expects absolute).
    // So I'll just clear cookie and return JSON if called via JS, or redirect if form?
    // Since it's a form submit, I should redirect.

    const url = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    const res = NextResponse.redirect(`${url}/`);

    res.cookies.set('token', '', { maxAge: -1, path: '/' });
    return res;
}
