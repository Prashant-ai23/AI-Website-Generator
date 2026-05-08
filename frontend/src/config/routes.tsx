import { Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import {
  LoginPage,
  RegisterPage,
  DashboardPage,
  GeneratorPage,
  SettingsPage,
  NotFoundPage,
} from '@/pages';
import { AIFeaturesPage } from '@/pages/AIFeaturesPage';
import { AIGeneratorPage } from '@/pages/AIGeneratorPage';
import { ProjectsDashboardPage } from '@/pages/ProjectsDashboardPage';
import { ProjectForm } from '@/pages/ProjectForm';
import { ProjectDetailsPage } from '@/pages/ProjectDetailsPage';
import { TemplateMarketplacePage } from '@/pages/TemplateMarketplacePage';
import { TemplateDetailsPage } from '@/pages/TemplateDetailsPage';
import { TemplateForm } from '@/pages/TemplateForm';

export const routes = [
  {
    path: '/',
    element: <Navigate to="/dashboard" />,
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
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/projects',
    element: (
      <ProtectedRoute>
        <ProjectsDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/projects/create',
    element: (
      <ProtectedRoute>
        <ProjectForm />
      </ProtectedRoute>
    ),
  },
  {
    path: '/projects/:id',
    element: (
      <ProtectedRoute>
        <ProjectDetailsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/projects/:id/edit',
    element: (
      <ProtectedRoute>
        <ProjectForm />
      </ProtectedRoute>
    ),
  },
  {
    path: '/templates',
    element: (
      <ProtectedRoute>
        <TemplateMarketplacePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/templates/create',
    element: (
      <ProtectedRoute>
        <TemplateForm />
      </ProtectedRoute>
    ),
  },
  {
    path: '/templates/:id',
    element: (
      <ProtectedRoute>
        <TemplateDetailsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/templates/:id/edit',
    element: (
      <ProtectedRoute>
        <TemplateForm />
      </ProtectedRoute>
    ),
  },
  {
    path: '/generator',
    element: (
      <ProtectedRoute>
        <GeneratorPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/ai-features',
    element: (
      <ProtectedRoute>
        <AIFeaturesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/ai-generator',
    element: (
      <ProtectedRoute>
        <AIGeneratorPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];
