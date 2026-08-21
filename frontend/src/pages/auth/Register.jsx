import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../common/Button';
import Card from '../../common/Card';
import { Mail, Lock, User, Hash, BookOpen, Calendar, AlertCircle } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    enrollmentNumber: '',
    branch: '',
    year: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (formData.password.length < 8) {
      return setError('Password must be at least 8 characters');
    }

    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = formData;
      const user = await register(submitData);
      navigate('/member/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-surface)' }}>
      {/* Left Side - Brand (Hidden on Mobile) */}
      <div style={{ flex: 1, backgroundColor: 'var(--color-surface)', color: 'var(--color-secondary)', display: 'flex', flexDirection: 'column', padding: '3rem', position: 'relative', overflow: 'hidden' }} className="hide-on-mobile">
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 0 }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 1 }}>
          <img src="/logo/kiet-logo.webp" alt="KIET" style={{ height: '50px', objectFit: 'contain' }} />
          <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--color-border)' }}></div>
          <img src="/logo/dsdl-logo.webp" alt="DSDL" style={{ height: '50px', objectFit: 'contain' }} />
        </div>
        <div style={{ marginTop: 'auto', marginBottom: 'auto', zIndex: 1 }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: '1.2', fontWeight: 'bold' }}>Join The <br /> Community</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--color-text-main)', maxWidth: '400px', lineHeight: '1.6', fontWeight: '500' }}>
            Create an account to participate in events, join project teams, and track your achievements.
          </p>
        </div>
        <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>&copy; {new Date().getFullYear()} DSDL Club. All rights reserved.</p>
          <Link to="/" style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
            &larr; Back to Public Site
          </Link>
        </div>
      </div>

      {/* Right side: Register Form */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '450px' }}>
          
          <div className="show-on-mobile" style={{ display: 'none', marginBottom: '3rem', textAlign: 'center' }}>
            <img src="/logo/dsdl-logo.webp" alt="DSDL" style={{ height: '50px' }} />
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.875rem', color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>Create Account</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>Fill in your details to get started.</p>
          </div>

          <Card style={{ padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
            {error && (
              <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-secondary)' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input 
                    type='text' 
                    name='name'
                    required
                    placeholder='John Doe' 
                    value={formData.name} 
                    onChange={handleChange} 
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', fontSize: '1rem', fontFamily: 'inherit' }} 
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-secondary)' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input 
                    type='email' 
                    name='email'
                    required
                    placeholder='name@dsdl.com' 
                    value={formData.email} 
                    onChange={handleChange} 
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', fontSize: '1rem', fontFamily: 'inherit' }} 
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-secondary)' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input 
                      type='password' 
                      name='password'
                      required
                      placeholder='********' 
                      value={formData.password} 
                      onChange={handleChange} 
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', fontSize: '1rem', fontFamily: 'inherit' }} 
                    />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-secondary)' }}>Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input 
                      type='password' 
                      name='confirmPassword'
                      required
                      placeholder='********' 
                      value={formData.confirmPassword} 
                      onChange={handleChange} 
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', fontSize: '1rem', fontFamily: 'inherit' }} 
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-secondary)' }}>Enrollment Number</label>
                <div style={{ position: 'relative' }}>
                  <Hash size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input 
                    type='text' 
                    name='enrollmentNumber'
                    placeholder='e.g., 202112345' 
                    value={formData.enrollmentNumber} 
                    onChange={handleChange} 
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', fontSize: '1rem', fontFamily: 'inherit' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-secondary)' }}>Branch</label>
                  <div style={{ position: 'relative' }}>
                    <BookOpen size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input 
                      type='text' 
                      name='branch'
                      placeholder='e.g., CSIT' 
                      value={formData.branch} 
                      onChange={handleChange} 
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', fontSize: '1rem', fontFamily: 'inherit' }} 
                    />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-secondary)' }}>Year</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input 
                      type='number' 
                      name='year'
                      placeholder='1, 2, 3, 4' 
                      value={formData.year} 
                      onChange={handleChange} 
                      min="1"
                      max="4"
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', fontSize: '1rem', fontFamily: 'inherit' }} 
                    />
                  </div>
                </div>
              </div>

              <Button type='submit' variant='primary' disabled={loading} style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', marginTop: '0.5rem', borderRadius: '8px' }}>
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)', textAlign: 'center', fontSize: '0.875rem' }}>
              <p style={{ color: 'var(--color-text-muted)' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '500', textDecoration: 'none' }}>
                  Sign in here
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
