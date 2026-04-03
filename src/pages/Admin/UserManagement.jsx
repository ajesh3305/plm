import React, { useState, useEffect } from 'react';
import app, { db, auth } from '../../firebase';
import { collection, getDocs, setDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, updatePassword } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { Card, CardHeader, CardBody } from '../../components/UI/Card';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ loginId: '', password: '', name: '', role: 'operator', status: 'active' });
  const [storedPassword, setStoredPassword] = useState('');
  const [editUserId, setEditUserId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const qs = await getDocs(collection(db, 'users'));
      setUsers(qs.docs.map(doc => ({ uid: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      let loginEmail = formData.loginId;
      if (!loginEmail.includes('@')) {
        loginEmail = loginEmail.toLowerCase().replace(/\\s+/g, '') + '@planttracker.local';
      }

      if (editUserId) {
        if (formData.password) {
          if (!storedPassword) {
            alert('Cannot update password because the old password was not stored for this account. Please delete and recreate the account instead.');
            return;
          }
          try {
            const secondaryApp = getApps().find(a => a.name === 'Secondary') || initializeApp(app.options, 'Secondary');
            const secondaryAuth = getAuth(secondaryApp);
            // Sign in using the database-stored old password automatically
            await signInWithEmailAndPassword(secondaryAuth, loginEmail, storedPassword);
            await updatePassword(secondaryAuth.currentUser, formData.password);
            await signOut(secondaryAuth);
          } catch (authErr) {
            console.error("Auth error:", authErr);
            alert("Failed to update password in Auth: " + authErr.message);
            return;
          }
        }
        await updateDoc(doc(db, 'users', editUserId), {
          name: formData.name,
          role: formData.role,
          status: formData.status,
          loginId: formData.loginId,
          email: loginEmail,
          password: formData.password || storedPassword
        });
      } else {
        // 1. Create a secondary app so the Admin session doesn't get logged out!
        const secondaryApp = getApps().find(a => a.name === 'Secondary') || initializeApp(app.options, 'Secondary');
        const secondaryAuth = getAuth(secondaryApp);

        // 2. Create user auth on the secondary instance
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, loginEmail, formData.password);
        const uid = userCredential.user.uid;

        // 3. Clean up the secondary session immediately
        await signOut(secondaryAuth);

        // 4. Store user record in Firestore using the Main Admin session which has proper write rules!
        await setDoc(doc(db, 'users', uid), {
          name: formData.name,
          role: formData.role,
          status: formData.status,
          loginId: formData.loginId,
          email: loginEmail,
          password: formData.password // Save the password in database for later viewing/editing
        });
      }

      setShowForm(false);
      setEditUserId(null);
      setStoredPassword('');
      setFormData({ loginId: '', password: '', name: '', role: 'operator', status: 'active' });
      fetchUsers();
    } catch (err) {
      console.error("Error saving user:", err);
      alert(err.message);
    }
  };

  const handleEditClick = (user) => {
    setFormData({
      loginId: user.loginId || (user.email ? user.email.split('@')[0] : ''),
      password: '',
      name: user.name,
      role: user.role,
      status: user.status
    });
    setStoredPassword(user.password || '');
    setEditUserId(user.uid);
    setShowForm(true);
  };

  const handleDeleteUser = async (uid) => {
    if (window.confirm('Are you sure you want to delete this user? This will remove their access to the app.')) {
      try {
        await deleteDoc(doc(db, 'users', uid));
        fetchUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Failed to delete user: " + err.message);
      }
    }
  };

  const toggleStatus = async (uid, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await updateDoc(doc(db, 'users', uid), { status: newStatus });
      fetchUsers();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Login ID', accessor: 'loginId', render: (val, row) => val || row.email },
    { header: 'Role', accessor: 'role', render: (val) => <span style={{ textTransform: 'capitalize' }}>{val}</span> },
    {
      header: 'Status',
      accessor: 'status',
      render: (val) => (
        <span style={{
          padding: '0.25rem 0.5rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.75rem',
          fontWeight: '600',
          backgroundColor: val === 'active' ? 'var(--success)' : 'var(--danger)',
          color: '#fff'
        }}>
          {val.toUpperCase()}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button size="sm" onClick={() => handleEditClick(row)}>Edit</Button>
          <Button size="sm" variant={row.status === 'active' ? 'danger' : 'primary'} onClick={() => toggleStatus(row.uid, row.status)}>
            {row.status === 'active' ? 'Deactivate' : 'Activate'}
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDeleteUser(row.uid)}>Delete</Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>User Management</h1>
        <Button onClick={() => {
          const newShow = !showForm;
          setShowForm(newShow);
          if (!newShow) {
            setEditUserId(null);
            setStoredPassword('');
            setFormData({ loginId: '', password: '', name: '', role: 'operator', status: 'active' });
          }
        }}>
          {showForm ? 'Cancel' : 'Add New User'}
        </Button>
      </div>

      {showForm && (
        <Card className="animate-slide-up" style={{ marginBottom: '1.5rem' }}>
          <CardHeader title={editUserId ? "Edit User" : "Create User"} />
          <CardBody>
            <form onSubmit={handleAddUser} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label="Full Name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              <Input label="Login ID" type="text" required value={formData.loginId} onChange={e => setFormData({ ...formData, loginId: e.target.value })} />

              {editUserId && (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Current Password</span>
                  <div style={{ marginTop: '0.25rem', padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', color: storedPassword ? 'inherit' : 'var(--text-muted)' }}>
                    {storedPassword || <span style={{ fontStyle: 'italic' }}>Not stored (Old account)</span>}
                  </div>
                </div>
              )}

              <Input
                label={editUserId ? "New Password" : "Password"}
                type="password"
                required={!editUserId}
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder={editUserId ? "Leave blank to keep current" : ""}
              />
              <Select
                label="Role"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                options={[
                  { label: 'Operator', value: 'operator' },
                  { label: 'Manager', value: 'manager' },
                  { label: 'Maintenance', value: 'maintenance' },
                  { label: 'Admin', value: 'admin' },
                ]}
              />
              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <Button type="submit">{editUserId ? "Update User" : "Create User"}</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      <Card>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading users...</div>
        ) : (
          <Table columns={columns} data={users} />
        )}
      </Card>
    </div>
  );
};

export default UserManagement;

