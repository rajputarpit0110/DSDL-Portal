import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../common/Button';
import Card from '../../common/Card';
import { Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/member/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (quickEmail, quickPassword) => {
    setError('');
    setLoading(true);
    try {
      const user = await login(quickEmail, quickPassword);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/member/dashboard');
    } catch (err) {
      setError('Quick login failed. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-surface)' }}>
      {/* Right Side - Brand (Hidden on Mobile) */}
      <div style={{ flex: 1, backgroundColor: 'var(--color-surface)', color: 'var(--color-secondary)', display: 'flex', flexDirection: 'column', padding: '3rem', position: 'relative', overflow: 'hidden' }} className="hide-on-mobile">
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 0 }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 1 }}>
          <img src="/logo/kiet-logo.webp" alt="KIET" style={{ height: '50px', objectFit: 'contain' }} />
          <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--color-border)' }}></div>
          <img src="/logo/kriva-logo.webp" alt="KRIVA" style={{ height: '50px', objectFit: 'contain' }} />
        </div>
        <div style={{ marginTop: 'auto', marginBottom: 'auto', zIndex: 1 }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: '1.2', fontWeight: 'bold' }}>Empowering <br /> Future Engineers</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--color-text-main)', maxWidth: '400px', lineHeight: '1.6', fontWeight: '500' }}>
            Join the community of passionate developers, learn new skills, and build amazing projects together.
          </p>
        </div>
        <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>© {new Date().getFullYear()} KRIVA Club. All rights reserved.</p>
          <Link to="/" style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
            ← Back to Public Site
          </Link>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          
          <div className="show-on-mobile" style={{ display: 'none', marginBottom: '3rem', textAlign: 'center' }}>
            <img src="/logo/kriva-logo.webp" alt="KRIVA" style={{ height: '50px' }} />
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.875rem', color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>Welcome Back</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>Enter your credentials to access your dashboard.</p>
          </div>

          <Card style={{ padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
            {error && (
              <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-secondary)' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input 
                    type='email' 
                    required
                    placeholder='name@kriva.com' 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', fontSize: '1rem', fontFamily: 'inherit' }} 
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-secondary)' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input 
                    type='password' 
                    required
                    placeholder='••••••••' 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', fontSize: '1rem', fontFamily: 'inherit' }} 
                  />
                </div>
              </div>

              <Button type='submit' variant='primary' disabled={loading} style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', marginTop: '0.5rem', borderRadius: '8px' }}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)', textAlign: 'center', fontSize: '0.875rem' }}>
              <p style={{ color: 'var(--color-text-muted)' }}>
                Don't have an account?{' '}
                <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: '500', textDecoration: 'none' }}>
                  Register here
                </Link>
              </p>
            </div>

            {/* Quick Login Buttons for Development/Testing */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', textAlign: 'center', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
                🚀 Quick Access (Dev Mode)
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={() => quickLogin('admin@kriva.local', 'admin123')}
                  disabled={loading}
                  style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--panel-solid)', color: 'white', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
                >
                  🔑 Login as Admin
                </button>
                <button
                  onClick={() => quickLogin('lead@kriva.local', 'password123')}
                  disabled={loading}
                  style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--accent-dim)', color: 'white', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
                >
                  🎯 Login as Domain Lead
                </button>
                <button
                  onClick={() => quickLogin('member@kriva.com', 'member123')}
                  disabled={loading}
                  style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: '#166534', color: 'white', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
                >
                  👤 Login as Member
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
