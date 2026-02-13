import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff, LogIn, Pill } from 'lucide-react';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('الرجاء إدخال اسم المستخدم وكلمة المرور');
            return;
        }

        setIsLoading(true);
        const result = await login(username.trim(), password.trim());
        setIsLoading(false);

        if (!result.success) {
            setError(result.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/3 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.02] rounded-full blur-3xl" />

            {/* Content */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-sm space-y-8"
            >
                {/* Logo area */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center"
                    >
                        <Pill className="h-10 w-10 text-primary" />
                    </motion.div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground tracking-tight">Dawak</h1>
                        <p className="text-sm text-muted-foreground/50 mt-1">تسجيل دخول المندوب</p>
                    </div>
                </div>

                {/* Login form */}
                <motion.form
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    {/* Username field */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
                            اسم المستخدم
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/[0.04]">
                                <User className="h-4 w-4 text-muted-foreground/40" />
                            </div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                autoComplete="username"
                                className="w-full h-14 pl-14 pr-4 rounded-xl border border-white/[0.06] bg-white/[0.02] text-foreground placeholder:text-muted-foreground/20 focus:outline-none focus:border-primary/30 focus:bg-white/[0.04] transition-all text-sm"
                            />
                        </div>
                    </div>

                    {/* Password field */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
                            كلمة المرور
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/[0.04]">
                                <Lock className="h-4 w-4 text-muted-foreground/40" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                autoComplete="current-password"
                                className="w-full h-14 pl-14 pr-12 rounded-xl border border-white/[0.06] bg-white/[0.02] text-foreground placeholder:text-muted-foreground/20 focus:outline-none focus:border-primary/30 focus:bg-white/[0.04] transition-all text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground/30" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground/30" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 rounded-xl bg-red-500/10 border border-red-500/10 text-center"
                        >
                            <p className="text-sm text-red-400" dir="rtl">{error}</p>
                        </motion.div>
                    )}

                    {/* Submit button */}
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full text-base shadow-xl shadow-primary/25 rounded-xl"
                        isLoading={isLoading}
                    >
                        {!isLoading && <LogIn className="mr-2 h-5 w-5" />}
                        تسجيل الدخول
                    </Button>
                </motion.form>

                {/* Footer hint */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-[11px] text-muted-foreground/25 leading-relaxed"
                    dir="rtl"
                >
                    بيانات الدخول يتم توفيرها من قبل المخزن
                </motion.p>
            </motion.div>
        </div>
    );
}
