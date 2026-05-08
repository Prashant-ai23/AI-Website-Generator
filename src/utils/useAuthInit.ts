import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { restoreAuth, setError } from '../store/slices/userSlice';
import { apiCallJson } from './api';

export const useAuthInit = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      // Verify token is still valid by fetching user info
      const token = localStorage.getItem('auth_token');
      if (token) {
        apiCallJson('/auth/me')
          .then((user) => {
            dispatch(restoreAuth(user));
          })
          .catch((error) => {
            console.error('Auth verification failed:', error);
            // Token is invalid, clear it
            localStorage.removeItem('auth_token');
            dispatch(setError('Session expired'));
          });
      }
    }
  }, []);
};
