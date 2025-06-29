import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  name: string;
  email: string;
  avatar: string; // url
  location?: string;
}

interface AuthContextValue {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('lt_user');
    return stored ? (JSON.parse(stored) as User) : null;
  });

  const login = (u: User) => {
    setUser(u);
    localStorage.setItem('lt_user', JSON.stringify(u));
  };

  const updateUser = (changes: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...changes } as User;
      localStorage.setItem('lt_user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lt_user');
  };

  useEffect(() => {
    // Sync other tabs
    const handler = (e: StorageEvent) => {
      if (e.key === 'lt_user') {
        setUser(e.newValue ? (JSON.parse(e.newValue) as User) : null);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
