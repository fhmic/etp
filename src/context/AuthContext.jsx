import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, setAuthToken } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [organisation, setOrganisation] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('etpd_access_token');
    if (!token) {
      setBooting(false);
      return;
    }
    setAuthToken(token);
    api.get('/auth/me')
      .then(({ data }) => {
        setUser(data.user);
        setOrganisation(data.organisation);
      })
      .catch(() => logout())
      .finally(() => setBooting(false));
  }, []);

  async function login(payload) {
    const { data } = await api.post('/auth/login', payload);
    localStorage.setItem('etpd_access_token', data.accessToken);
    localStorage.setItem('etpd_refresh_token', data.refreshToken);
    setAuthToken(data.accessToken);
    setUser(data.user);
    setOrganisation(data.user.organisation || data.organisation);
  }

  async function signup(payload) {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('etpd_access_token', data.accessToken);
    localStorage.setItem('etpd_refresh_token', data.refreshToken);
    setAuthToken(data.accessToken);
    setUser(data.user);
    setOrganisation(data.organisation);
  }

  function logout() {
    localStorage.removeItem('etpd_access_token');
    localStorage.removeItem('etpd_refresh_token');
    setAuthToken(null);
    setUser(null);
    setOrganisation(null);
  }

  const value = useMemo(() => ({ user, organisation, booting, login, signup, logout, setOrganisation }), [user, organisation, booting]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
