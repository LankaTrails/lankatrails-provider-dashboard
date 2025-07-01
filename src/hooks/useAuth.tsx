import { useAppDispatch, useAppSelector } from '@/store';
import { login, logoutUser, fetchProfile } from '@/store/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isLoading, error } = useAppSelector(state => state.auth);

  return {
    isAuthenticated,
    user,
    isLoading,
    error,
    login: (email: string, password: string) => dispatch(login({ email, password })),
    logout: () => dispatch(logoutUser()),
    restoreSession: () => dispatch(fetchProfile())
  };
};
