'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';

export function ProfileManager({ pharmacy }: { pharmacy: any }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: pharmacy.name,
        address: pharmacy.address,
        phone: pharmacy.phone,
        lat: pharmacy.lat?.toString() || '',
        lng: pharmacy.lng?.toString() || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
                    setError('Could not get location.');
                }
            );
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/pharmacy/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    lat: parseFloat(formData.lat),
                    lng: parseFloat(formData.lng)
                }),
            });

            if (!res.ok) throw new Error('Failed to update profile');

            setSuccess('Profile updated successfully!');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-3xl p-8 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 border border-white/20 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Pharmacy Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Pharmacy Name" name="name" value={formData.name} onChange={handleChange} required />
                <Input label="Address" name="address" value={formData.address} onChange={handleChange} required />
                <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />

                <div className="flex gap-2">
                    <Input label="Latitude" name="lat" value={formData.lat} onChange={handleChange} />
                    <Input label="Longitude" name="lng" value={formData.lng} onChange={handleChange} />
                </div>
                <Button type="button" variant="outline" size="sm" onClick={getUserLocation}>
                    Update Location
                </Button>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">{success}</p>}

                <Button type="submit" className="w-full" isLoading={loading}>
                    Save Changes
                </Button>
            </form>
        </div>
    );
}
