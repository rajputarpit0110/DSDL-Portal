import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from '../layout/PublicLayout';
import DashboardLayout from '../layout/DashboardLayout';

// Public Pages
import Home from '../pages/public/Home';
import DomainDetail from '../pages/public/DomainDetail';

import Login from '../pages/auth/Login';

// Auth Layout & Pages
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import MemberDashboard from '../pages/member/Dashboard';
import MemberEvents from '../pages/member/Events';
import MemberTeams from '../pages/member/Teams';
import MemberProjects from '../pages/member/Projects';
import MemberAchievements from '../pages/member/Achievements';
import AdminDashboard from '../pages/admin/Dashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageEvents from '../pages/admin/ManageEvents';
import ManageProjects from '../pages/admin/ManageProjects';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes with Public Layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/domain/:domainId" element={<DomainDetail />} />
      </Route>

      {/* Auth Pages (No layout) */}
      <Route path="/login" element={<Login />} />

      {/* Member Routes with Dashboard Layout */}
      <Route path="/member" element={
        <RoleRoute roles={['member', 'lead']}>
          <DashboardLayout />
        </RoleRoute>
      }>
        <Route path="dashboard" element={<MemberDashboard />} />
        <Route path="events" element={<MemberEvents />} />
        <Route path="teams" element={<MemberTeams />} />
        <Route path="projects" element={<MemberProjects />} />
        <Route path="achievements" element={<MemberAchievements />} />
      </Route>

      {/* Admin Routes with Dashboard Layout */}
      <Route path="/admin" element={
        <RoleRoute roles={['admin']}>
          <DashboardLayout />
        </RoleRoute>
      }>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="events" element={<ManageEvents />} />
        <Route path="projects" element={<ManageProjects />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
