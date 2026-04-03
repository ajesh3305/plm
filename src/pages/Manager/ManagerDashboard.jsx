import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RecordsView from './RecordsView';
import TrendsView from './TrendsView';

const ManagerDashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="records" replace />} />
      <Route path="records" element={<RecordsView />} />
      <Route path="trends" element={<TrendsView />} />
    </Routes>
  );
};

export default ManagerDashboard;
