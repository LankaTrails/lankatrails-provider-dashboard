import { useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { login, logoutUser, restoreSession as restoreSessionAction } from '@/store/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector(state => state.auth);
  const restoreSessionRef = useRef<Promise<any> | null>(null);

  const restoreSession = useCallback(async () => {
    // Return existing promise if restoration is already in progress
    if (restoreSessionRef.current) {
      return restoreSessionRef.current;
    }
    
    try {
      const promise = dispatch(restoreSessionAction()).unwrap();
      restoreSessionRef.current = promise;
      const result = await promise;
      return result;
    } catch (error) {
      throw error;
    } finally {
      restoreSessionRef.current = null;
    }
  }, [dispatch]);

  return {
    ...authState,
    login: (email: string, password: string) => dispatch(login({ email, password })).unwrap(),
    logout: () => dispatch(logoutUser()),
    restoreSession
  };
};
