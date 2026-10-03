import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RequireAuth, RequireGuest } from './store/RequireAuth';
import Layout from './components/layout/Layout';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import PlantListPage from './pages/plants/PlantListPage';
import PlantFormPage from './pages/plants/PlantFormPage';
import PlantDetailPage from './pages/plants/PlantDetailPage';
import TaskListPage from './pages/tasks/TaskListPage';
import TaskFormPage from './pages/tasks/TaskFormPage';
import HealthLogPage from './pages/health/HealthLogPage';
import HealthHistoryPage from './pages/health/HealthHistoryPage';
import EnvironmentLogPage from './pages/environment/EnvironmentLogPage';
import EnvironmentHistoryPage from './pages/environment/EnvironmentHistoryPage';
import ForumPage from './pages/community/ForumPage';
import PostDetailPage from './pages/community/PostDetailPage';
import PostFormPage from './pages/community/PostFormPage';
import SpecialistListPage from './pages/consultations/SpecialistListPage';
import BookingPage from './pages/consultations/BookingPage';
import MyAppointmentsPage from './pages/consultations/MyAppointmentsPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import ProfilePage from './pages/profile/ProfilePage';
import SettingsPage from './pages/profile/SettingsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route index element={<DashboardPage />} />

        <Route path="plants" element={<PlantListPage />} />
        <Route path="plants/new" element={<PlantFormPage />} />
        <Route path="plants/:id" element={<PlantDetailPage />} />
        <Route path="plants/edit/:id" element={<PlantFormPage />} />

        <Route path="tasks" element={<TaskListPage />} />
        <Route path="tasks/new" element={<TaskFormPage />} />
        <Route path="tasks/add" element={<TaskFormPage />} />
        <Route path="tasks/:id" element={<TaskFormPage />} />
        <Route path="tasks/edit/:id" element={<TaskFormPage />} />

        <Route path="health" element={<HealthHistoryPage />} />
        <Route path="health/log" element={<HealthLogPage />} />
        <Route path="health/log/:plantId" element={<HealthLogPage />} />

        <Route path="environment" element={<EnvironmentHistoryPage />} />
        <Route path="environment/log" element={<EnvironmentLogPage />} />
        <Route path="environment/log/:plantId" element={<EnvironmentLogPage />} />

        <Route path="community" element={<ForumPage />} />
        <Route path="community/post/:id" element={<PostDetailPage />} />
        <Route path="community/new" element={<PostFormPage />} />

        <Route path="consultations" element={<SpecialistListPage />} />
        <Route path="consultations/specialists" element={<SpecialistListPage />} />
        <Route path="consultations/book" element={<BookingPage />} />
        <Route path="consultations/book/:specialistId" element={<BookingPage />} />
        <Route path="consultations/my-appointments" element={<MyAppointmentsPage />} />

        <Route path="analytics" element={<AnalyticsPage />} />

        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route
        path="/login"
        element={
          <RequireGuest>
            <LoginPage />
          </RequireGuest>
        }
      />
      <Route
        path="/register"
        element={
          <RequireGuest>
            <RegisterPage />
          </RequireGuest>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
