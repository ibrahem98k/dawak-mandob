import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { Search, User, Menu } from 'lucide-react';

export async function Navbar() {
    const user = await getSession();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8">
            <div className="backdrop-blur-lg bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/30 shadow-xl rounded-full px-6 py-3 flex items-center justify-between max-w-7xl mx-auto">

                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
                        <img src="/logo.svg" alt="Spark Logo" className="w-8 h-8 object-contain" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
                        Dawak
                    </span>
                </Link>

                {/* Desktop Links (Hidden Mobile) */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
                    <Link href="/" className="hover:text-blue-500 transition-colors">Home</Link>
                    <Link href="/search" className="hover:text-blue-500 transition-colors">Find Meds</Link>
                    <Link href="#" className="hover:text-blue-500 transition-colors">Reservations</Link>
                </div>

                {/* Action Area */}
                <div className="flex items-center gap-4">
                    <Link href="/search">
                        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                            <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>
                    </Link>

                    {user ? (
                        <Link href={(user as any).role === 'customer' ? '/search' : '/pharmacy/dashboard'}>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400 p-[2px] cursor-pointer shadow-md hover:shadow-lg transition-all">
                                <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                                    {/* Placeholder Avatar or Initials */}
                                    <span className="text-sm font-bold text-gray-700 dark:text-white">
                                        {(user as any).email?.substring(0, 2).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ) : (
                        <Link href="/login">
                            <button className="px-5 py-2.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                                Sign In
                            </button>
                        </Link>
                    )}

                    {/* Mobile Menu (Simplified) */}
                    <div className="md:hidden">
                        <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </div>
                </div>
            </div>
        </nav>
    );
}
