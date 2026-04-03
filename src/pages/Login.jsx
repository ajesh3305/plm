import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Card, CardHeader, CardBody } from '../components/UI/Card';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import logo from '../assets/logo.png';

const Login = () => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let loginEmail = loginId;
    if (!loginEmail.includes('@')) {
      loginEmail = loginEmail.toLowerCase().replace(/\\s+/g, '') + '@planttracker.local';
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, password);
      const user = userCredential.user;
      
      // Check user role and status
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.status !== 'active') {
          setError('Your account is inactive. Contact admin.');
          auth.signOut();
        } else {
          // Navigate based on role
          if (userData.role === 'admin') navigate('/admin');
          else if (userData.role === 'manager') navigate('/manager');
          else navigate('/operator');
        }
      } else {
        setError('User record not found. Contact admin.');
        auth.signOut();
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      padding: '1rem'
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }} className="animate-slide-up">
        <div style={{ textAlign: 'center', marginBottom: window.innerWidth < 768 ? '1.5rem' : '2rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: 'var(--brand-primary)',
            color: 'white',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            marginBottom: '1rem',
            boxShadow: 'var(--shadow-md)'
          }}>
            <img src={logo} alt="Perfect Cartons Logo" style={{ width: '64px', height: 'auto' }} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Plant Production Tracker</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Login to your account to continue</p>
        </div>

        <Card>
          <CardBody>
            <form onSubmit={handleLogin}>
              <Input
                label="Login ID"
                type="text"
                id="loginId"
                placeholder="Enter your Login ID"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
              {error && (
                <div style={{ 
                  backgroundColor: '#fee2e2', 
                  color: 'var(--danger)', 
                  padding: '0.75rem', 
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  marginBottom: '1rem',
                  border: '1px solid #fecaca'
                }}>
                  {error}
                </div>
              )}

              <Button type="submit" fullWidth disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign In'}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Login;
