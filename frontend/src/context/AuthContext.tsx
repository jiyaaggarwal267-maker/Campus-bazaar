import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authAPI } from '@/lib/api';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import type { User } from '@/data/types';

interface AuthCtx {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signup: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user;

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('cb_token');
      const stored = localStorage.getItem('cb_user');
      if (token && stored) {
        try {
          setUser(JSON.parse(stored));
          connectSocket(token);
        } catch {}
      }
      setLoading(false);
    };
    init();
  }, []);

  const persist = (token: string, user: User) => {
    localStorage.setItem('cb_token', token);
    localStorage.setItem('cb_user', JSON.stringify(user));
    setUser(user);
    connectSocket(token);
  };

  const signup = async (name: string, email: string, password: string) => {
    const { token, user } = await authAPI.signup({ name, email, password });
    persist(token, user);
  };

  const login = async (email: string, password: string) => {
    const { token, user } = await authAPI.login({ email, password });
    persist(token, user);
  };

  const logout = () => {
    localStorage.removeItem('cb_token');
    localStorage.removeItem('cb_user');
    setUser(null);
    disconnectSocket();
  };

  const verifyEmail = async (token: string) => {
    const { token: newToken, user } = await authAPI.verifyEmail(token);
    persist(newToken, user);
  };

  const resendVerification = async () => {
    await authAPI.resendVerification();
  };

  const updateProfile = async (data: Partial<User>) => {
    const updated = await (await import('@/lib/api')).userAPI.updateMe(data);
    setUser(updated);
    localStorage.setItem('cb_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated, loading, signup, login, logout,
      verifyEmail, resendVerification, updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
