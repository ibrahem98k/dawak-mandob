import { Navigation, Phone, CheckCircle, MapPin, Loader2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import type { CallStatus, Pharmacy } from '../types';

interface ActionPanelProps {
    status: CallStatus;
    pharmacy: Pharmacy;
    onAccept: () => void;
    onCheckIn: () => void;
    onNavigate: () => void;
    onArrived?: () => void;
    onCancel?: () => void;
}

export function ActionPanel({ status, pharmacy, onAccept, onCheckIn, onNavigate, onArrived, onCancel }: ActionPanelProps) {
    if (status === 'idle') {
        return (
            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="space-y-3"
            >
                <Button
                    variant="primary"
                    size="lg"
                    className="w-full text-lg shadow-xl shadow-primary/30 rounded-xl"
                    onClick={onAccept}
                >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Accept Mission
                </Button>
            </motion.div>
        );
    }

    if (status === 'enroute') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
            >
                {/* Enroute Banner */}
                <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-b from-primary/8 to-primary/3 p-6">
                    {/* Animated progress bar */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/20">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary/60 via-primary to-primary/60"
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            style={{ width: '40%' }}
                        />
                    </div>
                    <div className="flex flex-col items-center gap-3 text-center">
                        <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="p-3 bg-primary/10 rounded-full"
                        >
                            <MapPin className="h-7 w-7 text-primary" />
                        </motion.div>
                        <div>
                            <p className="text-xl font-bold text-primary" dir="rtl">
                                المندوب في الطريق
                            </p>
                            <p className="text-sm text-muted-foreground/70 mt-1">
                                Heading to {pharmacy.name}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground/40">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span>Tracking location...</span>
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={onNavigate}
                        className="flex flex-col items-center justify-center gap-2 h-20 rounded-xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] transition-all active:scale-95"
                    >
                        <div className="p-2 rounded-lg bg-blue-500/10">
                            <Navigation className="h-5 w-5 text-blue-400" />
                        </div>
                        <span className="text-xs font-medium text-foreground/70">Navigate</span>
                    </button>

                    <a
                        href={`tel:${pharmacy.phone}`}
                        className="flex flex-col items-center justify-center gap-2 h-20 rounded-xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] transition-all active:scale-95"
                    >
                        <div className="p-2 rounded-lg bg-emerald-500/10">
                            <Phone className="h-5 w-5 text-emerald-400" />
                        </div>
                        <span className="text-xs font-medium text-foreground/70">Call</span>
                    </a>
                </div>

                <Button
                    variant="primary"
                    size="lg"
                    className="w-full shadow-xl shadow-primary/20 text-lg rounded-xl"
                    onClick={onArrived}
                >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    I've Arrived
                </Button>

                <button
                    onClick={onCancel}
                    className="w-full flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground/40 hover:text-red-400 transition-colors"
                >
                    <X className="h-3.5 w-3.5" />
                    Cancel Mission
                </button>
            </motion.div>
        );
    }

    if (status === 'pending') {
        return (
            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="space-y-3"
            >
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={onNavigate}
                        className="flex flex-col items-center justify-center gap-2 h-24 rounded-xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] transition-all active:scale-95"
                    >
                        <div className="p-2.5 rounded-xl bg-blue-500/10">
                            <Navigation className="h-6 w-6 text-blue-400" />
                        </div>
                        <span className="text-xs font-medium text-foreground/70">Navigate</span>
                    </button>

                    <a
                        href={`tel:${pharmacy.phone}`}
                        className="flex flex-col items-center justify-center gap-2 h-24 rounded-xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] transition-all active:scale-95"
                    >
                        <div className="p-2.5 rounded-xl bg-emerald-500/10">
                            <Phone className="h-6 w-6 text-emerald-400" />
                        </div>
                        <span className="text-xs font-medium text-foreground/70">Call</span>
                    </a>
                </div>

                <Button
                    variant="primary"
                    size="lg"
                    className="w-full shadow-xl shadow-primary/20 rounded-xl"
                    onClick={onCheckIn}
                >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    I'm Here (Check-in)
                </Button>

                <button
                    onClick={onCancel}
                    className="w-full flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground/40 hover:text-red-400 transition-colors"
                >
                    <X className="h-3.5 w-3.5" />
                    Cancel Mission
                </button>
            </motion.div>
        );
    }

    return null;
}
