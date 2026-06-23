import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/apiServices';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (!token || !savedUser) {
        setLoading(false);
        return;
      }

      try {
        setUser(JSON.parse(savedUser));
        const res = await authAPI.getMe();
        setUser(res.data.data);
        localStorage.setItem('user', JSON.stringify(res.data.data));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const userData = res.data.data;
    localStorage.setItem('token', userData.token);
    const { token, ...userWithoutToken } = userData;
    localStorage.setItem('user', JSON.stringify(userWithoutToken));
    setUser(userWithoutToken);
    return userWithoutToken;
  };

  const signup = async (name, email, password) => {
    const res = await authAPI.signup({ name, email, password });
    const userData = res.data.data;
    localStorage.setItem('token', userData.token);
    const { token, ...userWithoutToken } = userData;
    localStorage.setItem('user', JSON.stringify(userWithoutToken));
    setUser(userWithoutToken);
    return userWithoutToken;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';
  const isEditor = user?.role === 'editor';
  const isDepartmentUser = user?.role === 'department_user';
  const isViewer = user?.role === 'viewer';

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, signup, isAdmin, isEditor, isDepartmentUser, isViewer }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
