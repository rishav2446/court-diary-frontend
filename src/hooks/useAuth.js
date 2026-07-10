import { useSelector, useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, logout as logoutAction } from '../features/auth/authSlice';
import { loginUser } from '../services/authservice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { token, user, isLoading, error } = useSelector((state) => state.auth);

  const login = async (username, password) => {
    dispatch(loginStart());
    try {
      const data = await loginUser(username, password);
      if (data && data.token) {
        dispatch(loginSuccess({ token: data.token, username }));
        return { success: true };
      } else {
        const errorMsg = data?.message || 'Invalid credentials';
        dispatch(loginFailure(errorMsg));
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = err.message || 'Server connection failed';
      dispatch(loginFailure(errorMsg));
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  return {
    token,
    user,
    isLoading,
    error,
    isAuthenticated: !!token,
    login,
    logout,
  };
};
