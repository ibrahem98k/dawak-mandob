import { motion } from 'framer-motion';
import { FileText, CheckCircle, XCircle, Clock, ChevronLeft, Download, Camera, MessageSquare } from 'lucide-react';
import { Button } from '../components/Button';
import type { CallReport } from '../types';
import { useToast } from '../components/ToastProvider';

interface DailyReportPageProps {
    reports: CallReport[];
    onBack: () => void;
}

export function DailyReportPage({ reports, onBack }: DailyReportPageProps) {
    const { addToast } = useToast();

    const successCount = reports.filter(r => r.resolution === 'success').length;
    const rejectedCount = reports.filter(r => r.resolution === 'rejected').length;
    const postponedCount = reports.filter(r => r.resolution === 'postponed').length;

    const handleExport = () => {
        const reportData = {
            date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            totalCalls: reports.length,
            successCount,
            rejectedCount,
            postponedCount,
            reports: reports.map(r => ({
                callId: r.callId,
                pharmacy: r.pharmacyName || r.callId,
                resolution: r.resolution,
                notes: r.notes,
                photos: r.imageUrls?.length || 0,
                time: new Date(r.timestamp).toLocaleTimeString(),
            })),
        };
        console.log('📊 DAILY REPORT EXPORTED:', JSON.stringify(reportData, null, 2));
        addToast('Report exported successfully', 'success');
    };

    const resolutionConfig = {
        success: { icon: CheckCircle, color: 'emerald', label: 'Success' },
        rejected: { icon: XCircle, color: 'red', label: 'Rejected' },
        postponed: { icon: Clock, color: 'amber', label: 'Postponed' },
    };

    return (
        <div className="min-h-screen bg-background pb-safe-bottom">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center justify-between max-w-md mx-auto px-4 py-3">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-1 text-sm text-muted-foreground/60 hover:text-foreground transition"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back
                    </button>
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold">Daily Report</span>
                    </div>
                    <div className="w-12" /> {/* Spacer for centering */}
                </div>
            </div>

            <main className="container max-w-md mx-auto px-4 pt-16 pb-8 space-y-5">
                {/* Date */}
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center pt-4"
                >
                    <p className="text-xs text-muted-foreground/40 uppercase tracking-widest">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.05 }}
                    className="grid grid-cols-3 gap-3"
                >
                    <div className="text-center p-4 rounded-2xl border border-emerald-500/10 bg-emerald-500/5">
                        <CheckCircle className="h-5 w-5 text-emerald-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-emerald-400 font-mono">{successCount}</p>
                        <p className="text-[10px] text-emerald-400/50 uppercase tracking-wider mt-1">Success</p>
                    </div>
                    <div className="text-center p-4 rounded-2xl border border-red-500/10 bg-red-500/5">
                        <XCircle className="h-5 w-5 text-red-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-red-400 font-mono">{rejectedCount}</p>
                        <p className="text-[10px] text-red-400/50 uppercase tracking-wider mt-1">Rejected</p>
                    </div>
                    <div className="text-center p-4 rounded-2xl border border-amber-500/10 bg-amber-500/5">
                        <Clock className="h-5 w-5 text-amber-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-amber-400 font-mono">{postponedCount}</p>
                        <p className="text-[10px] text-amber-400/50 uppercase tracking-wider mt-1">Postponed</p>
                    </div>
                </motion.div>

                {/* Total card */}
                <motion.div
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="p-5 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-primary/8 to-transparent text-center"
                >
                    <p className="text-4xl font-bold text-primary font-mono">{reports.length}</p>
                    <p className="text-xs text-muted-foreground/40 uppercase tracking-wider mt-1">Total Completed</p>
                </motion.div>

                {/* Call Details */}
                {reports.length > 0 ? (
                    <motion.div
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.15 }}
                    >
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/40 mb-3">
                            Call Details
                        </h3>
                        <div className="space-y-2.5">
                            {reports.map((report, idx) => {
                                const config = resolutionConfig[report.resolution];
                                const Icon = config.icon;
                                const colorMap: Record<string, string> = {
                                    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/10',
                                    red: 'text-red-400 bg-red-500/10 border-red-500/10',
                                    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/10',
                                };
                                const colors = colorMap[config.color];

                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + idx * 0.04 }}
                                        className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2.5">
                                                <div className={`p-1.5 rounded-lg border ${colors}`}>
                                                    <Icon className="h-3.5 w-3.5" />
                                                </div>
                                                <span className="font-medium text-sm text-foreground/90">
                                                    {report.pharmacyName || report.callId}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground/30 font-mono">
                                                {new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        {/* Meta row */}
                                        <div className="flex items-center gap-3 ml-[34px]">
                                            {report.notes && (
                                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground/30">
                                                    <MessageSquare className="h-2.5 w-2.5" />
                                                    <span className="truncate max-w-[150px]">{report.notes}</span>
                                                </div>
                                            )}
                                            {report.imageUrls && report.imageUrls.length > 0 && (
                                                <div className="flex items-center gap-1 text-[10px] text-primary/40">
                                                    <Camera className="h-2.5 w-2.5" />
                                                    <span>{report.imageUrls.length}</span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-sm text-muted-foreground/40">No completed calls yet today.</p>
                        <p className="text-xs text-muted-foreground/20 mt-1">Complete some calls to see them here.</p>
                    </div>
                )}

                {/* Export Button */}
                <motion.div
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                >
                    <Button
                        variant="primary"
                        size="lg"
                        className="w-full shadow-xl shadow-primary/20 rounded-xl"
                        onClick={handleExport}
                    >
                        <Download className="mr-2 h-5 w-5" />
                        Export Report
                    </Button>
                </motion.div>
            </main>
        </div>
    );
}
