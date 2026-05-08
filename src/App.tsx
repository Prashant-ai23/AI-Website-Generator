import { BrowserRouter as Router, useRoutes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { routes } from './routes/routes';
import { Navbar } from './components/Navbar';
import { apiCallJson } from './utils/api';
import { restoreAuth, setError } from './store/slices/userSlice';
import { AppDispatch, RootState } from './store/store';

function AppContent() {
  const routeElements = useRoutes(routes);
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, token } = useSelector((state: RootState) => state.user);

  // Initialize auth on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken && isAuthenticated) {
      apiCallJson('/auth/me')
        .then((user) => {
          dispatch(restoreAuth(user));
        })
        .catch((error) => {
          console.error('Auth verification failed:', error);
          localStorage.removeItem('auth_token');
          dispatch(setError('Session expired'));
        });
    }
  }, []);

  // Show navbar everywhere except login and register
  const showNavbar = !['/login', '/register'].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      {routeElements}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
