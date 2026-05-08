import type { RouteObject } from 'react-router-dom';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import LoginPage from '../pages/Login';
import RegisterPage from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import AnalyzerPage from '../pages/Analyzer';
import CodeGeneratorPage from '../pages/CodeGenerator';
import BackendGeneratorPage from '../pages/BackendGenerator';
import DocumentationGeneratorPage from '../pages/DocumentationGenerator';
import FileGeneratorPage from '../pages/FileGenerator';
import ChatPage from '../pages/Chat';
import PreviewPage from '../pages/Preview';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/analyzer',
    element: (
      <ProtectedRoute>
        <AnalyzerPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/codegen',
    element: (
      <ProtectedRoute>
        <CodeGeneratorPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/apigen',
    element: (
      <ProtectedRoute>
        <BackendGeneratorPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/docs',
    element: (
      <ProtectedRoute>
        <DocumentationGeneratorPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/filegen',
    element: (
      <ProtectedRoute>
        <FileGeneratorPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/chat',
    element: (
      <ProtectedRoute>
        <ChatPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/preview',
    element: (
      <ProtectedRoute>
        <PreviewPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
