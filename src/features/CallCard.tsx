import { Phone, MapPin, User, Building2, Clock, ChevronRight } from 'lucide-react';
import type { Call } from '../types';

interface CallCardProps {
    call: Call;
}

export function CallCard({ call }: CallCardProps) {
    const { pharmacy } = call;

    return (
        <div className="w-full rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-transparent backdrop-blur-sm overflow-hidden">
            {/* Header with gradient accent line */}
            <div className="h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />

            <div className="p-5">
                {/* Top row */}
                <div className="flex justify-between items-start mb-5">
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-foreground tracking-tight">
                            {pharmacy.name}
                        </h3>
                        <p className="text-xs text-muted-foreground/50 font-mono">
                            {pharmacy.id}
                        </p>
                    </div>
                    <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/10">
                        <Building2 className="h-5 w-5 text-primary" />
                    </div>
                </div>

                {/* Info rows */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.03]">
                        <div className="p-1.5 rounded-lg bg-blue-500/10">
                            <User className="h-4 w-4 text-blue-400" />
                        </div>
                        <span className="font-medium text-sm">{pharmacy.doctorName}</span>
                    </div>

                    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.03]">
                        <div className="p-1.5 rounded-lg bg-amber-500/10">
                            <MapPin className="h-4 w-4 text-amber-400" />
                        </div>
                        <span className="text-sm text-muted-foreground flex-1">{pharmacy.address}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
                    </div>

                    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.03]">
                        <div className="p-1.5 rounded-lg bg-emerald-500/10">
                            <Phone className="h-4 w-4 text-emerald-400" />
                        </div>
                        <a href={`tel:${pharmacy.phone}`} className="text-sm text-primary hover:underline font-medium">
                            {pharmacy.phone}
                        </a>
                    </div>

                    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.03]">
                        <div className="p-1.5 rounded-lg bg-purple-500/10">
                            <Clock className="h-4 w-4 text-purple-400" />
                        </div>
                        <span className="text-sm text-muted-foreground">
                            Received {new Date(call.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
