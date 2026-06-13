import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_USERS = [
  { id: 1, email: 'demo@productivity.app', password: 'demo123', name: 'Ramya Gopalakrishnan', role: 'Admin', avatar: null, joinDate: '2024-01-15', bio: 'Productivity enthusiast & developer', theme: 'light' }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('pd_user');
    const remember = localStorage.getItem('pd_remember');
    if (stored && remember) {
      try { setUser(JSON.parse(stored)); } catch {}
    } else {
      const session = sessionStorage.getItem('pd_user');
      if (session) {
        try { setUser(JSON.parse(session)); } catch {}
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password, remember = false) => {
    const found = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, error: 'Invalid email or password' };
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    if (remember) {
      localStorage.setItem('pd_user', JSON.stringify(safeUser));
      localStorage.setItem('pd_remember', 'true');
    } else {
      sessionStorage.setItem('pd_user', JSON.stringify(safeUser));
    }
    return { success: true };
  };

  const register = (name, email, password) => {
    const exists = DEMO_USERS.find(u => u.email === email);
    if (exists) return { success: false, error: 'Email already registered' };
    const newUser = { id: Date.now(), email, name, role: 'User', avatar: null, joinDate: new Date().toISOString().split('T')[0], bio: '', theme: 'light' };
    DEMO_USERS.push({ ...newUser, password });
    setUser(newUser);
    sessionStorage.setItem('pd_user', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pd_user');
    localStorage.removeItem('pd_remember');
    sessionStorage.removeItem('pd_user');
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    const remember = localStorage.getItem('pd_remember');
    if (remember) localStorage.setItem('pd_user', JSON.stringify(updated));
    else sessionStorage.setItem('pd_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
