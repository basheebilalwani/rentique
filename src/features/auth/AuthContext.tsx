import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types/user.types';
import { authApi } from '@/services/api/authApi';
import { useToast } from '@/components/ui/ToastContext';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (newRole: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    async function initSession() {
      try {
        const current = await authApi.getCurrentUser();
        setUser(current);
      } catch (err) {
        console.error('Failed to load session:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initSession();
  }, []);

  const login = async (email: string) => {
    setIsLoading(true);
    try {
      const loggedIn = await authApi.login(email);
      setUser(loggedIn);
      toast(`Signed in as ${loggedIn.name} (${loggedIn.role})`, 'success');
    } catch (err) {
      toast('Login failed. Please try again.', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);
      toast('Successfully signed out.', 'info');
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = async (newRole: UserRole) => {
    setIsLoading(true);
    try {
      const switched = await authApi.switchRole(newRole);
      setUser(switched);
      toast(`Switched role to ${newRole.toUpperCase()} demo view`, 'info');
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    role: user?.role ?? null,
    isAdmin: user?.role === 'admin',
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    switchRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
