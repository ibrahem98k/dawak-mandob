import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { cn } from '../utils/cn';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    addToast: (message: string, type?: ToastType) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 3000);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className="fixed bottom-4 left-0 right-0 z-[100] flex flex-col items-center gap-2 pointer-events-none px-4">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            layout
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                            className={cn(
                                "pointer-events-auto flex items-center gap-3 rounded-full px-4 py-3 shadow-lg backdrop-blur-md border",
                                {
                                    'bg-green-500/10 border-green-500/20 text-green-500': toast.type === 'success',
                                    'bg-red-500/10 border-red-500/20 text-red-500': toast.type === 'error',
                                    'bg-blue-500/10 border-blue-500/20 text-blue-500': toast.type === 'info',
                                }
                            )}
                        >
                            {toast.type === 'success' && <CheckCircle className="h-5 w-5" />}
                            {toast.type === 'error' && <XCircle className="h-5 w-5" />}
                            {toast.type === 'info' && <Info className="h-5 w-5" />}

                            <span className="text-sm font-medium">{toast.message}</span>

                            <button
                                onClick={() => removeToast(toast.id)}
                                className="ml-2 opacity-50 hover:opacity-100"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
