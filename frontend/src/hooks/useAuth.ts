import { useAuthStore } from '../store/useAuthStore';

export const useAuth = () => {
  const { user, token, isAuthenticated, setAuth, logout } = useAuthStore();
  return {
    user,
    token,
    isAuthenticated,
    setAuth,
    logout,
    isAdmin: user?.role === 'ADMIN',
  };
};
