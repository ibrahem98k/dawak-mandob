import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '../components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import type { ResolutionType, CallReport, Location } from '../types';
import { ReportForm } from './ReportForm';

interface ResolutionModalProps {
    isOpen: boolean;
    onClose: () => void;
    callId: string;
    location: Location | null;
    onSubmit: (report: CallReport) => void;
    isSubmitting?: boolean;
}

export function ResolutionModal({ isOpen, onClose, callId, location, onSubmit, isSubmitting }: ResolutionModalProps) {
    const [resolution, setResolution] = useState<ResolutionType | null>(null);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="w-full max-w-lg"
                >
                    <Card className="shadow-2xl border-t border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-center">
                                {resolution ? 'Complete Report' : 'Call Outcome'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!resolution ? (
                                <div className="grid grid-cols-1 gap-3">
                                    <Button
                                        variant="primary"
                                        className="bg-green-600 hover:bg-green-700 h-16 text-lg justify-start px-6"
                                        onClick={() => setResolution('success')}
                                    >
                                        <CheckCircle className="mr-3 h-6 w-6" />
                                        Successful Visit
                                    </Button>

                                    <Button
                                        variant="secondary"
                                        className="h-16 text-lg justify-start px-6"
                                        onClick={() => setResolution('postponed')}
                                    >
                                        <Clock className="mr-3 h-6 w-6" />
                                        Postponed / Follow-up
                                    </Button>

                                    <Button
                                        variant="destructive"
                                        className="h-16 text-lg justify-start px-6"
                                        onClick={() => setResolution('rejected')}
                                    >
                                        <XCircle className="mr-3 h-6 w-6" />
                                        Rejected / No Sale
                                    </Button>

                                    <Button variant="ghost" onClick={onClose} className="mt-2">
                                        Cancel
                                    </Button>
                                </div>
                            ) : (
                                <ReportForm
                                    callId={callId}
                                    resolution={resolution}
                                    location={location}
                                    onSubmit={onSubmit}
                                    onCancel={() => setResolution(null)}
                                    isSubmitting={isSubmitting}
                                />
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}


