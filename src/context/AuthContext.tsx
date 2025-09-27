import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, clearToken } from '../lib/Auth/auth';

type Role = 'user' | 'consultant' | null;

type AuthContextType = {
  role: Role;
  loading: boolean;
  loadRole: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  role: null,
  loading: true,
  loadRole: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  const loadRole = async () => {
    setLoading(true);
    const token = await getToken();
    if (!token) {
      setRole(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        'https://no-ai-7f4bb5f0d7ab.herokuapp.com/auth/me',
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) {
        setRole(null);
      } else {
        const data = await res.json();
        setRole(data.role);
      }
    } catch (e) {
      console.error('loadRole error:', e);
      setRole(null);
    }
    setLoading(false);
  };

  const logout = async () => {
    await clearToken();
    setRole(null);
  };

  useEffect(() => {
    loadRole();
    // clearToken();
  }, []);

  return (
    <AuthContext.Provider value={{ role, loading, loadRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
