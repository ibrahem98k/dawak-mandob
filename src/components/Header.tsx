import { MapPin, Headset } from 'lucide-react';
import { cn } from '../utils/cn';

interface HeaderProps {
    isOnline?: boolean;
    locationStatus?: 'searching' | 'locked' | 'error';
}

export function Header({ isOnline = true, locationStatus = 'searching' }: HeaderProps) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/5 safe-top">
            <div className="flex items-center justify-between max-w-md mx-auto px-4 py-3">
                {/* Brand + Status */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5">
                        <div className="relative">
                            <div className={cn(
                                "h-2.5 w-2.5 rounded-full transition-colors",
                                isOnline ? "bg-emerald-400" : "bg-red-400"
                            )} />
                            {isOnline && (
                                <div className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping opacity-60" />
                            )}
                        </div>
                        <span className="text-xs font-medium text-foreground/70">
                            {isOnline ? 'Active' : 'Offline'}
                        </span>
                    </div>

                    <div className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all",
                        locationStatus === 'locked'
                            ? "bg-emerald-500/10 text-emerald-400"
                            : locationStatus === 'error'
                                ? "bg-red-500/10 text-red-400"
                                : "bg-amber-500/10 text-amber-400"
                    )}>
                        <MapPin className="h-3 w-3" />
                        <span>
                            {locationStatus === 'searching' && 'GPS...'}
                            {locationStatus === 'locked' && 'GPS ✓'}
                            {locationStatus === 'error' && 'No GPS'}
                        </span>
                    </div>
                </div>

                {/* Support Button */}
                <a
                    href="tel:+966500000000"
                    className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-full transition-all active:scale-95 border border-emerald-500/20"
                    title="اتصل بالمخزن"
                >
                    <Headset className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400">المخزن</span>
                </a>
            </div>
        </header>
    );
}
