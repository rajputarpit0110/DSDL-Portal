import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  User,
  Mail,
  Shield,
  Layers,
  GraduationCap,
  Phone,
  Tag,
  GitBranch,
  Globe,
  Lock,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
} from 'lucide-react';
import { apiClient } from '../../utils/apiClient';
import Alert from '../../common/Alert';
import { useToast } from '../../context/ToastContext';

const EditUserModal = ({ user, onClose, onSuccess }) => {
  const toast = useToast();
  const [domains, setDomains] = useState([]);
  const [activeTab, setActiveTab] = useState('account'); // 'account' | 'academic' | 'club' | 'security'

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'member',
    isActive: user?.isActive !== undefined ? user.isActive : true,
    enrollmentNumber: user?.enrollmentNumber || '',
    branch: user?.branch || '',
    year: user?.year ? String(user.year) : '',
    domainId: user?.domainId || '',
    phone: user?.phone || '',
    skills: Array.isArray(user?.skills) ? user.skills.join(', ') : (user?.skills || ''),
    bio: user?.bio || '',
    github: user?.github || '',
    linkedin: user?.linkedin || '',
    visibility: user?.visibility || 'public',
    password: '', // Optional new password
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient.get('/domains')
      .then(setDomains)
      .catch((err) => console.warn('Failed to load domains:', err.message));
  }, []);

  const validate = () => {
    if (!formData.name.trim()) {
      setError('Please provide the full name.');
      setActiveTab('account');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      setActiveTab('account');
      return false;
    }
    if (formData.password && formData.password.length < 6) {
      setError('If changing password, it must be at least 6 characters long.');
      setActiveTab('security');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setLoading(true);
    try {
      const userId = user.id || user._id;
      const payload = {
        ...formData,
        year: formData.year ? parseInt(formData.year, 10) : null,
      };
      if (!payload.password) {
        delete payload.password;
      }

      await apiClient.put(`/admin/users/${userId}`, payload);
      toast.success(`User "${formData.name}" updated successfully!`);
      onSuccess?.();
      onClose();
    } catch (err) {
      const msg = err.message || 'Failed to update user profile.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem 1.75rem',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#eff6ff',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <UserCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-secondary)', margin: 0 }}>
                Edit User Details
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
                Full manual control for <strong style={{ color: 'var(--color-secondary)' }}>{user?.name}</strong> ({user?.email})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            padding: '0.75rem 1.75rem',
            backgroundColor: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border)',
            overflowX: 'auto',
          }}
        >
          {[
            { id: 'account', label: 'Account & Role', icon: User },
            { id: 'academic', label: 'Academic Details', icon: GraduationCap },
            { id: 'club', label: 'Club & Profile', icon: Layers },
            { id: 'security', label: 'Security & Password', icon: Lock },
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  backgroundColor: isActive ? '#eff6ff' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <TabIcon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form Body with Scroll */}
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1 }}>
          {error && (
            <div style={{ marginBottom: '1.25rem' }}>
              <Alert variant="error" onClose={() => setError('')}>
                {error}
              </Alert>
            </div>
          )}

          <form id="edit-user-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* TAB 1: Account & Role */}
            {activeTab === 'account' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-secondary)' }}>
                      Full Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                      <input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.7rem 1rem 0.7rem 2.6rem',
                          borderRadius: '10px',
                          border: '1px solid var(--color-border)',
                          fontSize: '0.9rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-secondary)' }}>
                      Email Address <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.7rem 1rem 0.7rem 2.6rem',
                          borderRadius: '10px',
                          border: '1px solid var(--color-border)',
                          fontSize: '0.9rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-secondary)' }}>
                      System Role
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Shield size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.7rem 1rem 0.7rem 2.6rem',
                          borderRadius: '10px',
                          border: '1px solid var(--color-border)',
                          fontSize: '0.9rem',
                          outline: 'none',
                          backgroundColor: '#ffffff',
                          color: 'var(--color-secondary)',
                          cursor: 'pointer',
                          boxSizing: 'border-box',
                        }}
                      >
                        <option value="member">Member (Regular student member)</option>
                        <option value="lead">Lead (Domain Coordinator / Lead)</option>
                        <option value="admin">Admin (Full System Administrator)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-secondary)' }}>
                      Account Status
                    </label>
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.2rem' }}>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isActive: true })}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          padding: '0.65rem',
                          borderRadius: '8px',
                          border: formData.isActive ? '2px solid #10b981' : '1px solid var(--color-border)',
                          backgroundColor: formData.isActive ? '#dcfce7' : '#ffffff',
                          color: formData.isActive ? '#15803d' : 'var(--color-text-muted)',
                          fontWeight: formData.isActive ? '600' : '400',
                          cursor: 'pointer',
                        }}
                      >
                        <CheckCircle2 size={16} /> Active
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isActive: false })}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          padding: '0.65rem',
                          borderRadius: '8px',
                          border: !formData.isActive ? '2px solid #ef4444' : '1px solid var(--color-border)',
                          backgroundColor: !formData.isActive ? '#fee2e2' : '#ffffff',
                          color: !formData.isActive ? '#b91c1c' : 'var(--color-text-muted)',
                          fontWeight: !formData.isActive ? '600' : '400',
                          cursor: 'pointer',
                        }}
                      >
                        <XCircle size={16} /> Suspended
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: Academic Details */}
            {activeTab === 'academic' && (
              <>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-secondary)' }}>
                    Enrollment / Student ID Number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <GraduationCap size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                      placeholder="e.g. 05415602722"
                      value={formData.enrollmentNumber}
                      onChange={(e) => setFormData({ ...formData, enrollmentNumber: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem 0.7rem 2.6rem',
                        borderRadius: '10px',
                        border: '1px solid var(--color-border)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-secondary)' }}>
                      Branch / Department
                    </label>
                    <input
                      placeholder="e.g. Computer Science (CSE)"
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem',
                        borderRadius: '10px',
                        border: '1px solid var(--color-border)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-secondary)' }}>
                      Year of Study
                    </label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem',
                        borderRadius: '10px',
                        border: '1px solid var(--color-border)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        backgroundColor: '#ffffff',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="">Select Year...</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* TAB 3: Club & Profile */}
            {activeTab === 'club' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-secondary)' }}>
                      Assigned Technical Domain
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Layers size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                      <select
                        value={formData.domainId}
                        onChange={(e) => setFormData({ ...formData, domainId: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.7rem 1rem 0.7rem 2.6rem',
                          borderRadius: '10px',
                          border: '1px solid var(--color-border)',
                          fontSize: '0.9rem',
                          outline: 'none',
                          backgroundColor: '#ffffff',
                          boxSizing: 'border-box',
                        }}
                      >
                        <option value="">General / Cross-Domain</option>
                        {domains.map((d) => (
                          <option key={d.id || d._id} value={d.id || d._id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-secondary)' }}>
                      Phone / Contact Number
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                      <input
                        placeholder="+91 9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.7rem 1rem 0.7rem 2.6rem',
                          borderRadius: '10px',
                          border: '1px solid var(--color-border)',
                          fontSize: '0.9rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-secondary)' }}>
                    Technical Skills (comma-separated)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Tag size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                      placeholder="React, Node.js, Python, Figma, Docker"
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem 0.7rem 2.6rem',
                        borderRadius: '10px',
                        border: '1px solid var(--color-border)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-secondary)' }}>
                    Bio & Summary
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief bio or member achievements..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-secondary)' }}>
                      GitHub Profile URL
                    </label>
                    <div style={{ position: 'relative' }}>
                      <GitBranch size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                      <input
                        placeholder="https://github.com/username"
                        value={formData.github}
                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.7rem 1rem 0.7rem 2.6rem',
                          borderRadius: '10px',
                          border: '1px solid var(--color-border)',
                          fontSize: '0.9rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-secondary)' }}>
                      LinkedIn Profile URL
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Globe size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                      <input
                        placeholder="https://linkedin.com/in/username"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.7rem 1rem 0.7rem 2.6rem',
                          borderRadius: '10px',
                          border: '1px solid var(--color-border)',
                          fontSize: '0.9rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-secondary)' }}>
                    Profile Visibility
                  </label>
                  <select
                    value={formData.visibility}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.7rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.9rem',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="public">Public — Visible on public Members Directory & Club list</option>
                    <option value="private">Private — Hidden from public, only visible to Admins & Self</option>
                  </select>
                </div>
              </>
            )}

            {/* TAB 4: Security & Password */}
            {activeTab === 'security' && (
              <div>
                <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fef3c7', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <Lock size={18} color="#d97706" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#92400e', lineHeight: 1.5 }}>
                      <strong>Manual Password Override:</strong> Leave this field empty if you do not wish to change this user's password. If you enter a new password below, it will be hashed and updated immediately upon saving.
                    </p>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-secondary)' }}>
                    Set New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                      type="password"
                      placeholder="Leave blank to keep unchanged (min 6 characters)"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem 0.7rem 2.6rem',
                        borderRadius: '10px',
                        border: '1px solid var(--color-border)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#ffffff',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            User ID: <code>{user?.id || user?._id}</code>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                background: '#ffffff',
                color: 'var(--color-secondary)',
                fontWeight: '500',
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-user-form"
              disabled={loading}
              style={{
                padding: '0.65rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 2px 4px rgba(10, 102, 194, 0.2)',
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                  Saving Changes...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
