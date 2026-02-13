'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, MapPin } from 'lucide-react';

export function SearchForm() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);

        // Try to get location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    router.push(`/search?name=${encodeURIComponent(query)}&lat=${latitude}&lng=${longitude}`);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    // Fallback to search without location
                    router.push(`/search?name=${encodeURIComponent(query)}`);
                },
                { timeout: 5000 }
            );
        } else {
            router.push(`/search?name=${encodeURIComponent(query)}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="w-full max-w-md flex flex-col gap-4">
            <Input
                placeholder="Enter medicine name (e.g. Panadol)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                leftIcon={<Search className="h-5 w-5" />}
                className="h-12 text-lg shadow-sm"
                autoFocus
            />

            <Button
                type="submit"
                size="lg"
                className="w-full shadow-lg shadow-blue-500/30"
                isLoading={loading}
            >
                Find Nearby Pharmacies
            </Button>

            <p className="text-xs text-center text-gray-500 mt-2">
                <MapPin className="inline-block h-3 w-3 mr-1" />
                We use your location to find the nearest pharmacies.
            </p>
        </form>
    );
}
