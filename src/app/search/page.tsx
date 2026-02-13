import { getSession } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { Clock, Navigation, Phone, Search } from 'lucide-react';

async function getMedicines(name: string, lat?: string, lng?: string) {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    const url = new URL(`${baseUrl}/api/medicines/search`);
    url.searchParams.append('name', name);
    if (lat) url.searchParams.append('lat', lat);
    if (lng) url.searchParams.append('lng', lng);

    try {
        const res = await fetch(url.toString(), { cache: 'no-store' });
        if (!res.ok) return [];
        const data = await res.json();
        return data.medicines || [];
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
}

export default async function SearchPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const user = await getSession();
    const name = typeof searchParams.name === 'string' ? searchParams.name : '';
    const lat = typeof searchParams.lat === 'string' ? searchParams.lat : undefined;
    const lng = typeof searchParams.lng === 'string' ? searchParams.lng : undefined;

    const medicines = await getMedicines(name, lat, lng);

    return (
        <div className="container mx-auto px-4 pt-24 pb-8 max-w-lg">

            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight">
                        {user ? `Hello, ${user.email.split('@')[0]}!` : 'Meds at \n Your Doorstep'}
                    </h1>
                    {user && <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Ready to order?</p>}
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center rotate-6 shadow-sm">
                    <span className="text-2xl">💊</span>
                </div>
            </div>

            {/* Courier Status Card (Mocked) */}
            <div className="rounded-3xl p-6 backdrop-blur-lg shadow-xl hover:shadow-2xl transition-all duration-300 bg-blue-500 text-white !border-none relative overflow-hidden mb-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />

                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-blue-100 text-xs font-bold tracking-wider uppercase mb-1">Your Courier</h3>
                        <h2 className="text-2xl font-bold">Sophia <br /> Thompson</h2>
                    </div>
                    <div className="bg-gray-900/30 backdrop-blur-md rounded-2xl w-16 h-16 flex flex-col items-center justify-center border border-white/10">
                        <span className="text-xl font-bold">23</span>
                        <span className="text-[10px] text-blue-200">min</span>
                    </div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-sm text-blue-50">
                    <p className="mb-2">This delivery features two cold remedies and 5% cashback on order.</p>
                    <div className="flex justify-between items-center text-xs font-mono opacity-80 mt-4">
                        <span>ORDER</span>
                        <span>TR-763-134-1</span>
                    </div>
                </div>
            </div>

            {/* Search Bar Refined */}
            <div className="mb-8">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-2 shadow-sm flex items-center gap-2 border border-gray-100">
                    <Search className="w-5 h-5 text-gray-400 ml-3" />
                    <form className="flex-1">
                        <input
                            type="text"
                            placeholder="Search medicines..."
                            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
                            defaultValue={name}
                        />
                    </form>
                </div>
            </div>

            {/* Recent Orders / Results List */}
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex justify-between items-center">
                <span>Nearby Pharmacies</span>
                <span className="text-xs text-gray-400 font-normal cursor-pointer hover:text-blue-500">view all</span>
            </h3>

            <div className="space-y-4">
                {medicines.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <p>No medicines found.</p>
                    </div>
                ) : (
                    medicines.map((item: any) => (
                        <div key={item.id} className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                    <Navigation className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                                    <p className="text-xs text-gray-500 mt-1">{item.pharmacy_name}</p>
                                    <p className="text-[10px] text-blue-400 mt-1 font-medium">{item.distance ? `${item.distance.toFixed(1)}km away` : 'Nearby'}</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full mb-2 inline-block">
                                    ${item.price}
                                </div>
                                <div className="flex justify-end gap-2">
                                    <a href={`tel:${item.phone}`} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-600">
                                        <Phone className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
