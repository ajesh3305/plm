import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, Server, Briefcase, FileText, Settings, LogOut, ClipboardList } from 'lucide-react';
import logo from '../../assets/logo.png';

const Sidebar = ({ isOpen, isMobile, toggleSidebar }) => {
  const { userRole } = useAuth();

  const width = isOpen ? '250px' : '0px';
  const padding = isOpen ? '1rem' : '0';

  const navItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    marginBottom: '0.5rem',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    transition: 'background-color 0.2s, color 0.2s',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  };

  const getActiveStyle = ({ isActive }) => {
    return {
      ...navItemStyle,
      backgroundColor: isActive ? 'var(--brand-primary)' : 'transparent',
      color: isActive ? '#fff' : 'var(--text-secondary)'
    };
  };

  return (
    <aside style={{
      width: width,
      backgroundColor: 'var(--bg-secondary)',
      borderRight: isMobile ? 'none' : '1px solid var(--border-color)',
      transition: 'width 0.3s ease, padding 0.3s ease, left 0.3s ease',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      padding: padding,
      position: isMobile ? 'absolute' : 'relative',
      top: 0,
      left: 0,
      height: '100%',
      zIndex: 50,
      boxShadow: isMobile && isOpen ? 'var(--shadow-lg)' : 'none'
    }}>
      <div style={{
        padding: '1rem',
        marginBottom: '2rem',
        fontWeight: 'bold',
        fontSize: '1.25rem',
        color: 'var(--brand-primary)',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <img src={logo} alt="Logo" style={{ width: '32px', height: 'auto', borderRadius: '4px' }} />
        {isOpen && <span style={{ fontSize: '1.1rem' }}>Perfect Cartons</span>}
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {/* Operator Links */}
        {(userRole === 'admin' || userRole === 'operator') && (
          <NavLink to="/operator" style={getActiveStyle} onClick={isMobile ? toggleSidebar : undefined}>
            <ClipboardList size={20} style={{ minWidth: '20px', marginRight: '0.75rem' }} />
            {isOpen && <span>Data Entry</span>}
          </NavLink>
        )}

        {/* Manager Links */}
        {(userRole === 'admin' || userRole === 'manager') && (
          <>
            <div style={{ margin: '1rem 0 0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold' }}>Reporting</div>
            <NavLink to="/manager/records" style={getActiveStyle} onClick={isMobile ? toggleSidebar : undefined}>
              <FileText size={20} style={{ minWidth: '20px', marginRight: '0.75rem' }} />
              {isOpen && <span>Records Data</span>}
            </NavLink>
            <NavLink to="/manager/trends" style={getActiveStyle} onClick={isMobile ? toggleSidebar : undefined}>
              <LayoutDashboard size={20} style={{ minWidth: '20px', marginRight: '0.75rem' }} />
              {isOpen && <span>Trends & Reports</span>}
            </NavLink>
          </>
        )}

        {/* Admin Links */}
        {userRole === 'admin' && (
          <>
            <div style={{ margin: '1rem 0 0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold' }}>Admin Settings</div>
            <NavLink to="/admin/users" style={getActiveStyle} onClick={isMobile ? toggleSidebar : undefined}>
              <Users size={20} style={{ minWidth: '20px', marginRight: '0.75rem' }} />
              {isOpen && <span>User Management</span>}
            </NavLink>
            <NavLink to="/admin/machines" style={getActiveStyle} onClick={isMobile ? toggleSidebar : undefined}>
              <Server size={20} style={{ minWidth: '20px', marginRight: '0.75rem' }} />
              {isOpen && <span>Machine Settings</span>}
            </NavLink>
            <NavLink to="/admin/jobs" style={getActiveStyle} onClick={isMobile ? toggleSidebar : undefined}>
              <Briefcase size={20} style={{ minWidth: '20px', marginRight: '0.75rem' }} />
              {isOpen && <span>Job Management</span>}
            </NavLink>
            <NavLink to="/admin/operator-machines" style={getActiveStyle} onClick={isMobile ? toggleSidebar : undefined}>
              <Settings size={20} style={{ minWidth: '20px', marginRight: '0.75rem' }} />
              {isOpen && <span>Operator Machines</span>}
            </NavLink>
          </>
        )}
      </nav>

      {isOpen && (
        <div style={{ padding: '1rem', marginTop: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          v1.0.0 &copy; 2026
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
