import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

import Login from './pages/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManagerDashboard from './pages/Manager/ManagerDashboard';
import OperatorDashboard from './pages/Operator/OperatorDashboard';
import Layout from './components/Layout/Layout';

// Role-based Route Protection
const PrivateRoute = ({ children, allowedRoles }) => {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!currentUser) return <Navigate to="/login" />;
  if (userRole === 'inactive') return <div style={{ padding: '2rem' }}><h2>Account Inactive</h2><p>Please contact an administrator.</p></div>;
  if (allowedRoles && !allowedRoles.includes(userRole)) return <Navigate to="/" />;

  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/admin/*" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } />

          <Route path="/manager/*" element={
            <PrivateRoute allowedRoles={['admin', 'manager']}>
              <ManagerDashboard />
            </PrivateRoute>
          } />

          <Route path="/operator/*" element={
            <PrivateRoute allowedRoles={['admin', 'operator']}>
              <OperatorDashboard />
            </PrivateRoute>
          } />

          {/* Default Route based on role or login */}
          <Route path="/" element={<RootRedirect />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const RootRedirect = () => {
  const { currentUser, userRole, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!currentUser) return <Navigate to="/login" />;

  if (userRole === 'admin') return <Navigate to="/admin" />;
  if (userRole === 'manager') return <Navigate to="/manager" />;
  if (userRole === 'operator') return <Navigate to="/operator" />;

  return <Navigate to="/login" />; // fallback
};

export default App;
