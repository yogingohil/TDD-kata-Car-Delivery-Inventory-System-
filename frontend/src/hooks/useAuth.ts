import { useAuthStore } from '../store/authStore.js';

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
