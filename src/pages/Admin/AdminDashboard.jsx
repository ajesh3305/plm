import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Card, CardBody } from '../../components/UI/Card';
import { Users, Server, Briefcase, Settings } from 'lucide-react';

// Placeholders for Admin Views
import UserManagement from './UserManagement';
import MachineManagement from './MachineManagement';
import JobManagement from './JobManagement';
import OperatorMachineManagement from './OperatorMachineManagement';

const AdminHub = () => {
  const navigate = useNavigate();

  const cards = [
    { title: 'User Management', desc: 'Add, edit, and deactivate users by role.', icon: <Users size={32} color="var(--brand-primary)" />, path: '/admin/users' },
    { title: 'Machine Management', desc: 'Manage the master list of facility machines.', icon: <Server size={32} color="var(--success)" />, path: '/admin/machines' },
    { title: 'Job Management', desc: 'Manage the master list of production jobs.', icon: <Briefcase size={32} color="var(--warning)" />, path: '/admin/jobs' },
    { title: 'Operator Machines', desc: 'Assign machines to operators routines.', icon: <Settings size={32} color="var(--info)" />, path: '/admin/operator-machines' }
  ];

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Admin Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {cards.map((item, idx) => (
          <Card
            key={idx}
            className="hover-card"
            style={{ cursor: 'pointer', transition: 'transform 0.2s', ':hover': { transform: 'translateY(-4px)' } }}
          >
            <div onClick={() => navigate(item.path)} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-full)', width: 'fit-content' }}>
                {item.icon}
              </div>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.125rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>{item.desc}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminHub />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="machines" element={<MachineManagement />} />
      <Route path="jobs" element={<JobManagement />} />
      <Route path="operator-machines" element={<OperatorMachineManagement />} />
    </Routes>
  );
};

export default AdminDashboard;
