import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store/store';
import { clearUser } from '../store/slices/userSlice';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    dispatch(clearUser());
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">AI Website Generator</h1>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                <div className="text-sm">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-gray-400 text-xs">
                    {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="hover:text-blue-400 transition">
                  Login
                </a>
                <a href="/register" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition">
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
