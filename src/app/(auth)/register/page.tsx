'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Store, UserPlus, MapPin, Phone, Building, User, Mail, Lock, Map, Sparkles, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [role, setRole] = useState<'customer' | 'pharmacy-owner'>('customer');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        address: '',
        phone: '',
        lat: '',
        lng: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev,
                        lat: position.coords.latitude.toString(),
                        lng: position.coords.longitude.toString()
                    }));
                },
                (err) => {
                    console.error(err);
                    setError('Could not get location. Please enter manually or try again.');
                }
            );
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    role: role,
                    lat: formData.lat ? parseFloat(formData.lat) : null,
                    lng: formData.lng ? parseFloat(formData.lng) : null
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            if (role === 'customer') {
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
        <div className="glass-card p-8 md:p-10 space-y-8 relative overflow-hidden animate-fadeIn max-w-2xl w-full">
            {/* Decorative background glow (Restored) */}
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl -z-10 animate-pulse" />

            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/30 mb-4 text-purple-500 animate-bounce-slow">
                    <UserPlus className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight mb-2">
                    <span className="text-gradient">Create Account</span>
                </h2>

                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {role === 'customer'
                        ? 'Join to easily find medicines near you.'
                        : 'Register your pharmacy to reach more customers.'}
                </p>

                {/* Role Switcher */}
                <div className="flex bg-gray-100/50 dark:bg-slate-800/50 p-1.5 rounded-2xl mt-8 relative border border-white/20">
                    <button
                        type="button"
                        onClick={() => setRole('customer')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm transition-all duration-300 ${role === 'customer'
                                ? 'tab-active'
                                : 'tab-inactive'
                            }`}
                    >
                        <User className="w-4 h-4" /> Customer
                    </button>
                    <button
                        type="button"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2 space-y-1">
                        <label className="text-xs font-semibold text-gray-500 ml-1 uppercase tracking-wider">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            onChange={handleChange}
                            placeholder="name@example.com"
                            className="input-premium"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                        <label className="text-xs font-semibold text-gray-500 ml-1 uppercase tracking-wider">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            onChange={handleChange}
                            placeholder="Create a strong password"
                            className="input-premium"
                        />
                    </div>

                    {/* Pharmacy Specific Fields */}
                    {role === 'pharmacy-owner' && (
                        <>
                            <div className="md:col-span-2 space-y-1 animate-slideIn">
                                <label className="text-xs font-semibold text-gray-500 ml-1 uppercase tracking-wider">Pharmacy Name</label>
                                <input
                                    name="name"
                                    required
                                    onChange={handleChange}
                                    placeholder="e.g. City Pharmacy"
                                    className="input-premium"
                                />
                            </div>

                            <div className="space-y-1 animate-slideIn delay-100">
                                <label className="text-xs font-semibold text-gray-500 ml-1 uppercase tracking-wider">Address</label>
                                <input
                                    name="address"
                                    required
                                    onChange={handleChange}
                                    placeholder="Street Address"
                                    className="input-premium"
                                />
                            </div>
                            <div className="space-y-1 animate-slideIn delay-200">
                                <label className="text-xs font-semibold text-gray-500 ml-1 uppercase tracking-wider">Phone</label>
                                <input
                                    name="phone"
                                    required
                                    onChange={handleChange}
                                    placeholder="+1 234 567 890"
                                    className="input-premium"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-4 animate-slideIn delay-300">
                                <div className="flex items-end gap-4">
                                    <div className="flex-1 space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 ml-1 uppercase tracking-wider">Latitude</label>
                                        <input
                                            name="lat"
                                            value={formData.lat}
                                            onChange={handleChange}
                                            placeholder="0.0000"
                                            className="input-premium"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 ml-1 uppercase tracking-wider">Longitude</label>
                                        <input
                                            name="lng"
                                            value={formData.lng}
                                            onChange={handleChange}
                                            placeholder="0.0000"
                                            className="input-premium"
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={getUserLocation}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                                >
                                    <MapPin className="w-4 h-4" /> Get Current Location
                                </Button>
                            </div>
                        </>
                    )}
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
                        <span className="flex items-center justify-center gap-2 group-hover:gap-3 transition-all">
                            {role === 'customer' ? 'Create Customer Account' : 'Register Pharmacy'}
                            <ArrowRight className="w-5 h-5" />
                        </span>
                    </Button>
                </div>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link href="/login" className="font-bold text-blue-600 hover:text-blue-500 transition-colors hover:underline">
                        Sign In
                    </Link>
                </p>
            </form>
        </div>
    );
}
