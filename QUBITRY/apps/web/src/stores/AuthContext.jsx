import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api.js';
import AuthModal from '../components/auth/AuthModal.jsx';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('qubitry_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('qubitry_token') || null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  // Validate session on boot
  useEffect(() => {
    async function verifySession() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await authAPI.getMe();
        if (res.user) {
          setUser(res.user);
          localStorage.setItem('qubitry_user', JSON.stringify(res.user));
        }
      } catch (err) {
        console.warn('Session expired or invalid, logging out.');
        logout();
      } finally {
        setLoading(false);
      }
    }
    verifySession();
  }, [token]);

  const login = async ({ email, password }) => {
    const res = await authAPI.login({ email, password });
    if (res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('qubitry_token', res.token);
      localStorage.setItem('qubitry_user', JSON.stringify(res.user));
    }
    return res;
  };

  const register = async ({ username, email, password }) => {
    const res = await authAPI.register({ username, email, password });
    if (res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('qubitry_token', res.token);
      localStorage.setItem('qubitry_user', JSON.stringify(res.user));
    }
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('qubitry_token');
    localStorage.removeItem('qubitry_user');
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        login,
        register,
        logout,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

