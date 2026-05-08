import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { Navbar } from '../components/Navbar';

export default function Home() {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to AI Website Generator
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create amazing websites with AI-powered design and content
          </p>
          <div className="flex gap-4 justify-center">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
