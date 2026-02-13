'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Store, ArrowRight, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            router.push('/pharmacy/dashboard');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-md w-full glass-card !bg-white/40 dark:!bg-slate-900/60 p-8 md:p-10 space-y-8 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl">
                <div className="text-center">
                    <div className="mx-auto w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center text-white rotate-3 shadow-lg mb-6 overflow-hidden">
                        <img src="/logo.svg" alt="Pharmacy Logo" className="w-12 h-12 object-contain" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Pharmacy Login
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        Access your dashboard to manage meds.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <Input
                            label="Email Address"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="pharmacy@example.com"
                            leftIcon={<Mail className="w-5 h-5" />}
                            className="bg-white/60 dark:bg-slate-800/60"
                        />
                        <Input
                            label="Password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            leftIcon={<Lock className="w-5 h-5" />}
                            className="bg-white/60 dark:bg-slate-800/60"
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center border border-red-100 dark:border-red-800">
                            {error}
                        </div>
                    )}

                    <div>
                        <Button
                            type="submit"
                            className="w-full py-4 text-lg btn-primary-gradient shadow-blue-500/25"
                            isLoading={loading}
                        >
                            <span className="flex items-center gap-2">
                                Sign In <ArrowRight className="w-5 h-5" />
                            </span>
                        </Button>
                    </div>

                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <Link href="/pharmacy/register" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
                            Register Now
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
