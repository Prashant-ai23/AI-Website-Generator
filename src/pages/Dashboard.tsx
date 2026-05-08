import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Navbar } from '../components/Navbar';

export default function Dashboard() {
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name}!</h2>
            <p className="text-gray-600 mb-4">Email: {user?.email}</p>
            <p className="text-gray-600 mb-4">
              Role: <span className="font-semibold">{user?.role === 'admin' ? '👑 Admin' : '👤 User'}</span>
            </p>
            <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
              <p className="text-sm text-blue-700">
                ℹ️ You are successfully authenticated! Token is stored in localStorage.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Features</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span>JWT Authentication</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span>Role-Based Access Control</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span>Token Storage</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span>Protected Routes</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span>Automatic Logout</span>
              </li>
            </ul>
          </div>
        </div>

        {user?.role === 'admin' && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-yellow-800 mb-3">Admin Panel</h3>
            <p className="text-yellow-700">You have admin privileges. Additional features available.</p>
          </div>
        )}

        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">API Endpoints</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded">
              <p className="font-mono text-sm">POST /auth/register</p>
              <p className="text-xs text-gray-600">Register new user</p>
            </div>
            <div className="bg-white p-4 rounded">
              <p className="font-mono text-sm">POST /auth/login</p>
              <p className="text-xs text-gray-600">Login user</p>
            </div>
            <div className="bg-white p-4 rounded">
              <p className="font-mono text-sm">GET /auth/me</p>
              <p className="text-xs text-gray-600">Get current user (protected)</p>
            </div>
            <div className="bg-white p-4 rounded">
              <p className="font-mono text-sm">POST /auth/logout</p>
              <p className="text-xs text-gray-600">Logout user (protected)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
