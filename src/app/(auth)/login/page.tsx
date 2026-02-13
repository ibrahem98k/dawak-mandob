'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Store, ArrowRight, Lock, Mail, User, Sparkles } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [role, setRole] = useState<'customer' | 'pharmacy-owner'>('customer');
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

            if (data.user.role === 'customer') {
                router.push('/search');
            } else {
                router.push('/pharmacy/dashboard');
            }
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card p-8 md:p-12 space-y-8 relative overflow-hidden animate-fadeIn">
            {/* Decorative background glow inside card (Restored) */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl -z-10 animate-pulse" />

            {/* Header / Role Selector */}
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 mb-4 text-blue-500 animate-bounce-slow">
                    <Sparkles className="w-6 h-6" />
                </div>
                <h2 className="text-4xl font-extrabold tracking-tight mb-2">
                    <span className="text-gradient">Welcome Back</span>
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {role === 'customer'
                        ? 'Sign in to access your health dashboard.'
                        : 'Manage your pharmacy efficiently.'}
                </p>

                <div className="flex bg-gray-100/50 dark:bg-slate-800/50 p-1.5 rounded-2xl mt-8 relative border border-white/20">
                    <button
                        onClick={() => setRole('customer')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm transition-all duration-300 ${role === 'customer'
                                ? 'tab-active'
                                : 'tab-inactive'
                            }`}
                    >
                        <User className="w-4 h-4" /> Customer
                    </button>
                    <button
                        onClick={() => setRole('pharmacy-owner')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm transition-all duration-300 ${role === 'pharmacy-owner'
                                ? 'tab-active'
                                : 'tab-inactive'
                            }`}
                    >
                        <Store className="w-4 h-4" /> Pharmacy
                    </button>
                </div>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 ml-1 uppercase tracking-wider">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="input-premium"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 ml-1 uppercase tracking-wider">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="input-premium"
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-4 rounded-2xl bg-red-50/80 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm text-center border border-red-100 dark:border-red-800 backdrop-blur-sm animate-shake">
                        {error}
                    </div>
                )}

                <div>
                    <Button
                        type="submit"
                        className="w-full py-4 text-lg btn-primary-gradient group rounded-xl"
                        isLoading={loading}
                    >
                        <span className="flex items-center gap-2 group-hover:gap-3 transition-all">
                            Sign In <ArrowRight className="w-5 h-5" />
                        </span>
                    </Button>
                </div>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link href="/register" className="font-bold text-blue-600 hover:text-blue-500 transition-colors hover:underline">
                        Register as {role === 'customer' ? 'Customer' : 'Pharmacy'}
                    </Link>
                </p>
            </form>
        </div>
    );
}
