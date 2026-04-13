import { useNavigate } from 'react-router-dom';

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export function useAuth() {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');
  const user: AuthUser | null = userRaw ? JSON.parse(userRaw) : null;
  const isAuthenticated = !!token;

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  return { user, token, isAuthenticated, logout };
}
