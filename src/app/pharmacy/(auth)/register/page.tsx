'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Store, UserPlus, MapPin, Phone, Map, Building } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'pharmacy-owner',
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
                    lat: formData.lat ? parseFloat(formData.lat) : null,
                    lng: formData.lng ? parseFloat(formData.lng) : null
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed');
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
            <div className="max-w-2xl w-full glass-card !bg-white/40 dark:!bg-slate-900/60 p-8 md:p-10 space-y-8 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl">
                <div className="text-center">
                    <div className="mx-auto w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center text-white rotate-[-3deg] shadow-lg mb-6 overflow-hidden">
                        <img src="/logo.svg" alt="Register Logo" className="w-12 h-12 object-contain" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Register Pharmacy
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        Join our network and reach more customers.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            required
                            onChange={handleChange}
                            className="bg-white/60 dark:bg-slate-800/60"
                        />
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            required
                            onChange={handleChange}
                            className="bg-white/60 dark:bg-slate-800/60"
                        />

                        <div className="md:col-span-2">
                            <Input
                                label="Pharmacy Name"
                                name="name"
                                required
                                onChange={handleChange}
                                leftIcon={<Store className="w-5 h-5" />}
                                className="bg-white/60 dark:bg-slate-800/60"
                            />
                        </div>

                        <Input
                            label="Address"
                            name="address"
                            required
                            onChange={handleChange}
                            leftIcon={<Building className="w-5 h-5" />}
                            className="bg-white/60 dark:bg-slate-800/60"
                        />
                        <Input
                            label="Phone Number"
                            name="phone"
                            required
                            onChange={handleChange}
                            leftIcon={<Phone className="w-5 h-5" />}
                            className="bg-white/60 dark:bg-slate-800/60"
                        />

                        <div className="md:col-span-2 space-y-4">
                            <div className="flex items-end gap-4">
                                <div className="flex-1">
                                    <Input
                                        label="Location (Lat/Lng)"
                                        name="lat"
                                        value={formData.lat}
                                        onChange={handleChange}
                                        placeholder="Latitude"
                                        leftIcon={<Map className="w-5 h-5" />}
                                        className="bg-white/60 dark:bg-slate-800/60"
                                    />
                                </div>
                                <div className="flex-1">
                                    <Input
                                        name="lng"
                                        value={formData.lng}
                                        onChange={handleChange}
                                        placeholder="Longitude"
                                        className="bg-white/60 dark:bg-slate-800/60"
                                    />
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={getUserLocation}
                                className="w-full flex items-center justify-center gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                                <MapPin className="w-4 h-4" /> Get Current Location
                            </Button>
                        </div>
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
                            Create Account
                        </Button>
                    </div>

                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link href="/pharmacy/login" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
                            Sign In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
