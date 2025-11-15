
"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import api, { getUserStatus } from '@/lib/api';

interface User {
  _id: string;
  email: string;
  isAdmin: boolean;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      if (typeof window !== 'undefined' && localStorage.getItem('token')) {
        try {
          const res = await getUserStatus();
          setUser(res.data.user);
        } catch (_) {
          setUser(null);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', res.data.token);
      }
      const userRes = await getUserStatus();
      setUser(userRes.data.user);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/register', { email, password });
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', res.data.token);
      }
      const userRes = await getUserStatus();
      setUser(userRes.data.user);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
