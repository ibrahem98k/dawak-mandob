import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
    username: string;
    name: string;
    warehouseName: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock credentials — in production these come from the مخزن system
const MOCK_CREDENTIALS = [
    { username: 'mandob1', password: 'dawak2024', name: 'Ahmed Hassan', warehouseName: 'مخزن الحياة' },
    { username: 'mandob2', password: 'dawak2024', name: 'Ibrahim Ali', warehouseName: 'مخزن الدواء' },
    { username: 'admin', password: 'admin', name: 'Test User', warehouseName: 'مخزن تجريبي' },
];

const AUTH_STORAGE_KEY = 'dawak_auth_session';

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Restore session from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setUser(parsed);
            } catch {
                localStorage.removeItem(AUTH_STORAGE_KEY);
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const found = MOCK_CREDENTIALS.find(
            c => c.username === username && c.password === password
        );

        if (found) {
            const userData: User = {
                username: found.username,
                name: found.name,
                warehouseName: found.warehouseName,
            };
            setUser(userData);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
            return { success: true };
        }

        return { success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
    };

    if (isLoading) {
        return null; // Don't render children until session is restored
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
