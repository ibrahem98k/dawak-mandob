import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from './components/Header';
import { CallCard } from './features/CallCard';
import { ActionPanel } from './features/ActionPanel';
import { ResolutionModal } from './features/ResolutionModal';
import { DailyReportPage } from './features/DailyReportModal';
import { LoginPage } from './features/LoginPage';
import { useGeolocation } from './hooks/useGeolocation';
import { useAuth } from './context/AuthContext';
import { api } from './utils/mockApi';
import type { Call, CallReport } from './types';
import { Loader2, FileText, ChevronLeft, Power, Clock, Building2, CheckCircle, MapPin, LogOut } from 'lucide-react';
import { useToast } from './components/ToastProvider';
import { Button } from './components/Button';

function App() {
  const { isAuthenticated, user, logout } = useAuth();

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <AppContent user={user!} onLogout={logout} />;
}

function AppContent({ user, onLogout }: { user: { name: string; warehouseName: string }; onLogout: () => void }) {
  const [isWorking, setIsWorking] = useState(false);
  const { location, error: locationError } = useGeolocation(isWorking);
  const [calls, setCalls] = useState<Call[]>([]);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResolutionOpen, setIsResolutionOpen] = useState(false);
  const [isDailyReportOpen, setIsDailyReportOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedReports, setCompletedReports] = useState<CallReport[]>([]);
  const { addToast } = useToast();

  useEffect(() => {
    api.fetchAssignedCalls().then((data) => {
      setCalls(data);
      setIsLoading(false);
    });
  }, []);

  const handleStartWork = () => {
    setIsWorking(true);
    addToast('Shift Started — GPS Active', 'success');
  };

  const handleStopWork = () => {
    setIsWorking(false);
    setSelectedCall(null);
    addToast('Shift Ended — GPS Off', 'info');
  };

  const handleAccept = () => {
    if (selectedCall) {
      const updated = { ...selectedCall, status: 'pending' as const, acceptedAt: Date.now() };
      setSelectedCall(updated);
      setCalls(prev => prev.map(c => c.id === updated.id ? updated : c));
      addToast('Mission Accepted', 'success');
    }
  };

  const handleNavigate = () => {
    if (selectedCall?.pharmacy) {
      const { latitude, longitude } = selectedCall.pharmacy;
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank');
    }
  };

  const handleCheckIn = () => {
    if (selectedCall) {
      const updated = { ...selectedCall, status: 'enroute' as const };
      setSelectedCall(updated);
      setCalls(prev => prev.map(c => c.id === updated.id ? updated : c));
      addToast('المندوب في الطريق', 'info');
    }
  };

  const handleArrived = () => {
    if (selectedCall) {
      const updated = { ...selectedCall, status: 'resolution' as const };
      setSelectedCall(updated);
      setCalls(prev => prev.map(c => c.id === updated.id ? updated : c));
      setIsResolutionOpen(true);
      addToast('You have arrived!', 'success');
    }
  };

  const handleCancel = () => {
    if (selectedCall) {
      const updated = { ...selectedCall, status: 'idle' as const };
      setCalls(prev => prev.map(c => c.id === updated.id ? updated : c));
      setSelectedCall(null);
      addToast('Mission Cancelled', 'info');
    }
  };

  const handleSubmitReport = async (report: CallReport) => {
    setIsSubmitting(true);
    const enrichedReport: CallReport = {
      ...report,
      pharmacyName: selectedCall?.pharmacy.name,
    };
    await api.submitReport(enrichedReport);
    setIsSubmitting(false);
    setIsResolutionOpen(false);
    setCompletedReports(prev => [...prev, enrichedReport]);
    if (selectedCall) {
      const updated = { ...selectedCall, status: 'completed' as const };
      setCalls(prev => prev.map(c => c.id === updated.id ? updated : c));
      setSelectedCall(null);
    }
    addToast('Report Submitted Successfully', 'success');
  };

  const handleBack = () => {
    if (selectedCall && selectedCall.status === 'idle') {
      setSelectedCall(null);
    }
  };

  // Format time ago
  const timeAgo = (timestamp: number) => {
    const mins = Math.round((Date.now() - timestamp) / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    return `${hrs}h ${mins % 60}m ago`;
  };

  // ─── Daily Report Full Page ──────────────────────────
  if (isDailyReportOpen) {
    return (
      <DailyReportPage
        reports={completedReports}
        onBack={() => setIsDailyReportOpen(false)}
      />
    );
  }

  // ─── Loading State ─────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
            <div className="absolute inset-0 h-10 w-10 rounded-full bg-primary/5 animate-ping" />
          </div>
          <p className="text-sm text-muted-foreground/50">Loading assignments...</p>
        </div>
      </div>
    );
  }

  // ─── Not Working — Preview mode ─────────────────────
  if (!isWorking) {
    const activeCalls = calls.filter(c => c.status !== 'completed');

    return (
      <div className="min-h-screen bg-background pb-safe-bottom">
        <Header isOnline={false} locationStatus="searching" />

        <main className="container max-w-md mx-auto px-4 pt-20 pb-8 space-y-5">
          {/* Start Work CTA */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/8 via-primary/4 to-transparent p-5"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="relative space-y-3">
              {/* User info */}
              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className="text-sm font-semibold text-foreground/90">مرحباً, {user.name}</p>
                  <p className="text-[10px] text-muted-foreground/40" dir="rtl">{user.warehouseName}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground/30 hover:text-red-400 transition-colors"
                  title="تسجيل الخروج"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-400" />
                <span className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">Shift Not Started</span>
              </div>
              <p className="text-sm text-muted-foreground/80">
                Start your shift to activate GPS tracking and accept assignments
              </p>
              <Button
                variant="primary"
                size="lg"
                className="w-full text-base shadow-xl shadow-primary/25 rounded-xl"
                onClick={handleStartWork}
              >
                <Power className="mr-2 h-5 w-5" />
                Start Work
              </Button>
            </div>
          </motion.div>

          {/* Assignments Preview */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/60">
                Today's Assignments
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground/40 font-mono">
                {activeCalls.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {activeCalls.map((call, idx) => (
                <motion.div
                  key={call.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 0.5, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                >
                  <div className="p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.02]">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-primary/50" />
                        <span className="font-medium text-sm text-foreground/80">{call.pharmacy.name}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground/30 font-mono">
                        {new Date(call.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground/40 ml-5.5 pl-[22px]">{call.pharmacy.doctorName}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ─── Detail View ─────────────────────────────────────
  if (selectedCall) {
    return (
      <div className="min-h-screen bg-background pb-safe-bottom">
        <Header
          isOnline={true}
          locationStatus={location ? 'locked' : locationError ? 'error' : 'searching'}
        />

        <main className="container max-w-md mx-auto px-4 pt-20 pb-8 space-y-5">
          {/* Back */}
          {selectedCall.status === 'idle' && (
            <motion.button
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              onClick={handleBack}
              className="flex items-center gap-1 text-sm text-muted-foreground/50 hover:text-foreground transition"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </motion.button>
          )}

          {/* Status badge area */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/40">
                {selectedCall.status === 'idle' ? 'Assignment Details' :
                  selectedCall.status === 'enroute' ? 'Enroute' : 'Active Mission'}
              </h2>
              {selectedCall.status === 'pending' && (
                <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20 animate-pulse uppercase tracking-wider">
                  In Progress
                </span>
              )}
              {selectedCall.status === 'enroute' && (
                <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 animate-pulse" dir="rtl">
                  في الطريق
                </span>
              )}
            </div>

            <CallCard call={selectedCall} />
          </motion.div>

          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <ActionPanel
              status={selectedCall.status}
              pharmacy={selectedCall.pharmacy}
              onAccept={handleAccept}
              onCheckIn={handleCheckIn}
              onNavigate={handleNavigate}
              onArrived={handleArrived}
              onCancel={handleCancel}
            />
          </motion.div>
        </main>

        {isResolutionOpen && (
          <ResolutionModal
            isOpen={isResolutionOpen}
            onClose={() => setIsResolutionOpen(false)}
            callId={selectedCall.id}
            location={location}
            onSubmit={handleSubmitReport}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    );
  }

  // ─── Assignments List (Working) ──────────────────────
  const activeCalls = calls.filter(c => c.status !== 'completed');
  const completedCalls = calls.filter(c => c.status === 'completed');
  const progress = calls.length > 0 ? Math.round((completedCalls.length / calls.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background pb-safe-bottom">
      <Header
        isOnline={true}
        locationStatus={location ? 'locked' : locationError ? 'error' : 'searching'}
      />

      <main className="container max-w-md mx-auto px-4 pt-20 pb-8 space-y-5">
        {/* Progress summary card */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="p-4 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-foreground">Active Shift</h2>
              <p className="text-xs text-muted-foreground/50 mt-0.5">
                {completedCalls.length}/{calls.length} completed
              </p>
            </div>
            <div className="flex items-center gap-2">
              {completedReports.length > 0 && (
                <button
                  onClick={() => setIsDailyReportOpen(true)}
                  className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                >
                  <FileText className="h-4 w-4 text-primary/60" />
                </button>
              )}
              <div className="text-lg font-bold text-primary font-mono">{progress}%</div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Active assignments */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/40">
              Remaining
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary/70 font-mono">
              {activeCalls.length}
            </span>
          </div>

          <div className="space-y-2.5">
            {activeCalls.map((call, idx) => (
              <motion.div
                key={call.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                onClick={() => setSelectedCall(call)}
                className="cursor-pointer group"
              >
                <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-primary/15 transition-all active:scale-[0.98]">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-primary/8 group-hover:bg-primary/15 transition-colors">
                        <Building2 className="h-4 w-4 text-primary/70" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-foreground/90 group-hover:text-foreground transition-colors">
                          {call.pharmacy.name}
                        </h4>
                        <p className="text-xs text-muted-foreground/40 mt-0.5">{call.pharmacy.doctorName}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400/70 font-medium">
                        New
                      </span>
                      <span className="text-[10px] text-muted-foreground/30 font-mono flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {timeAgo(call.receivedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 ml-[38px]">
                    <MapPin className="h-3 w-3 text-muted-foreground/20" />
                    <p className="text-[11px] text-muted-foreground/30 truncate">{call.pharmacy.address}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Completed section */}
        {completedCalls.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/40">
                Completed
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400/70 font-mono">
                {completedCalls.length}
              </span>
            </div>
            <div className="space-y-2">
              {completedCalls.map(call => (
                <div key={call.id} className="p-3 rounded-xl border border-white/[0.03] bg-white/[0.01] opacity-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500/50" />
                      <span className="text-sm text-foreground/50">{call.pharmacy.name}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400/40 font-medium">Done</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All done celebration */}
        {activeCalls.length === 0 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12 space-y-4"
          >
            <div className="text-5xl">🎉</div>
            <h2 className="text-xl font-bold text-primary">All Done!</h2>
            <p className="text-sm text-muted-foreground/50">You've completed all assignments for today.</p>
            {completedReports.length > 0 && (
              <Button
                variant="outline"
                size="lg"
                className="mt-2 rounded-xl"
                onClick={() => setIsDailyReportOpen(true)}
              >
                <FileText className="mr-2 h-4 w-4" />
                View Daily Report
              </Button>
            )}
          </motion.div>
        )}

        {/* Stop Work */}
        <div className="pt-4">
          <button
            onClick={handleStopWork}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500/10 bg-red-500/5 hover:bg-red-500/10 text-red-400/60 hover:text-red-400 transition-all text-sm font-medium active:scale-[0.98]"
          >
            <Power className="h-4 w-4" />
            End Shift
          </button>
        </div>
      </main>

      {/* FAB */}
      {completedReports.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <button
            onClick={() => setIsDailyReportOpen(true)}
            className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/10 hover:bg-primary/20 transition-colors active:scale-95"
          >
            <FileText className="h-5 w-5 text-primary" />
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default App;
