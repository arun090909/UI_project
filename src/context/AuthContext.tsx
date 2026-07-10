'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types';
import { mockUser } from '@/data/mock';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, role: 'employee' | 'employer') => Promise<void>;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Stub: treat mock user as "logged in" for UI development.
  // Replace login() body with a real POST /api/auth/login call that returns a JWT.
  const [user, setUser] = useState<User | null>(mockUser);
  const [token, setToken] = useState<string | null>('stub-jwt-token');

  async function login(email: string, _password: string, role: 'employee' | 'employer') {
    // TODO: POST /api/auth/login → { accessToken, user }
    // const res = await fetch('/api/auth/login', { method:'POST', body: JSON.stringify({ email, password, role }) });
    // const { accessToken, user } = await res.json();
    // store token in HTTP-only cookie via Next.js route handler, then:
    setToken('stub-jwt-token');
    setUser({ ...mockUser, email, role });
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  function updateUser(patch: Partial<User>) {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
