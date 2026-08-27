import React, { useState, useEffect } from 'react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Badge from '../../common/Badge';
import ConfirmModal from '../../common/ConfirmModal';
import AddMemberModal from '../../components/admin/AddMemberModal';
import EditUserModal from '../../components/admin/EditUserModal';
import ResetPasswordModal from '../../components/admin/ResetPasswordModal';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  KeyRound,
  Shield,
  UserX,
  Users,
  Layers,
  GraduationCap,
  RefreshCw,
} from 'lucide-react';
import { apiClient } from '../../utils/apiClient';
import { useToast } from '../../context/ToastContext';

const getRoleBadgeColor = (role) => {
  switch (role?.toLowerCase()) {
    case 'admin': return '#8b5cf6';
    case 'lead': return '#0a66c2';
    case 'member': return '#64748b';
    default: return '#64748b';
  }
};

const ManageUsers = () => {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [domainFilter, setDomainFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [userToResetPassword, setUserToResetPassword] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsersAndDomains = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [usersData, domainsData] = await Promise.all([
        apiClient.get('/admin/users'),
        apiClient.get('/domains').catch(() => [])
      ]);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setDomains(Array.isArray(domainsData) ? domainsData : []);
    } catch (err) {
      toast.error(err.message || 'Failed to load users data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsersAndDomains();
  }, []);

  // Quick Role Change
  const handleQuickRoleChange = async (userId, newRole) => {
    try {
      await apiClient.patch(`/admin/users/${userId}/role`, { role: newRole });
      toast.success(`Role updated to ${newRole.toUpperCase()}`);
      setUsers(prev => prev.map(u => (u.id === userId || u._id === userId) ? { ...u, role: newRole } : u));
    } catch (err) {
      toast.error(err.message || 'Failed to update user role.');
    }
  };

  // Quick Status Toggle (Active / Suspended)
  const handleToggleStatus = async (user) => {
    const userId = user.id || user._id;
    const newStatus = !user.isActive;
    try {
      await apiClient.patch(`/admin/users/${userId}/status`, { isActive: newStatus });
      toast.success(`User "${user.name}" ${newStatus ? 'activated' : 'suspended'}`);
      setUsers(prev => prev.map(u => (u.id === userId || u._id === userId) ? { ...u, isActive: newStatus } : u));
    } catch (err) {
      toast.error(err.message || 'Failed to change status.');
    }
  };

  // Delete User Confirmation
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const userId = deleteTarget.id || deleteTarget._id;
    setActionLoading(true);
    try {
      await apiClient.delete(`/admin/users/${userId}`);
      toast.success(`User "${deleteTarget.name}" deleted permanently.`);
      setDeleteTarget(null);
      fetchUsersAndDomains();
    } catch (err) {
      toast.error(err.message || 'Failed to delete user.');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter Logic
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.enrollmentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.branch?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(u.skills) && u.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesRole = roleFilter === 'ALL' || u.role?.toLowerCase() === roleFilter.toLowerCase();
    
    const matchesDomain =
      domainFilter === 'ALL' ||
      u.domainId === domainFilter ||
      (domainFilter === 'NONE' && !u.domainId);

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && u.isActive) ||
      (statusFilter === 'SUSPENDED' && !u.isActive);

    return matchesSearch && matchesRole && matchesDomain && matchesStatus;
  });

  // Calculate Metrics
  const totalCount = users.length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const leadCount = users.filter(u => u.role === 'lead').length;
  const memberCount = users.filter(u => u.role === 'member').length;
  const suspendedCount = users.filter(u => !u.isActive).length;

  if (loading && users.length === 0) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        <RefreshCw size={32} className="spinner" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ fontWeight: 500 }}>Loading user management console...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Add User Modal */}
      {showAddModal && (
        <AddMemberModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchUsersAndDomains();
          }}
        />
      )}

      {/* Edit User Modal */}
      {userToEdit && (
        <EditUserModal
          user={userToEdit}
          onClose={() => setUserToEdit(null)}
          onSuccess={() => {
            setUserToEdit(null);
            fetchUsersAndDomains();
          }}
        />
      )}

      {/* Reset Password Modal */}
      {userToResetPassword && (
        <ResetPasswordModal
          user={userToResetPassword}
          onClose={() => setUserToResetPassword(null)}
          onSuccess={() => setUserToResetPassword(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Permanently Delete User"
        message={`Are you sure you want to delete "${deleteTarget?.name}" (${deleteTarget?.email})? All associated profile data and memberships will be removed. This cannot be undone.`}
        confirmText="Delete User Account"
        confirmVariant="danger"
        loading={actionLoading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-secondary)', margin: 0 }}>
            Manage Users & Accounts
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Full manual administrative control over roles, credentials, profile metadata, and accounts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => fetchUsersAndDomains(true)}
            disabled={refreshing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.6rem 0.9rem',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              backgroundColor: '#ffffff',
              color: 'var(--color-secondary)',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}
            title="Refresh user list"
          >
            <RefreshCw size={15} className={refreshing ? 'spinner' : ''} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>

          <Button
            variant="primary"
            onClick={() => setShowAddModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem' }}
          >
            <Plus size={16} /> Add New User
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <Card style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#eff6ff', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Total Users</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--color-secondary)' }}>{totalCount}</div>
          </div>
        </Card>

        <Card style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#f3e8ff', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Admins</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--color-secondary)' }}>{adminCount}</div>
          </div>
        </Card>

        <Card style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Domain Leads</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--color-secondary)' }}>{leadCount}</div>
          </div>
        </Card>

        <Card style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Members</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--color-secondary)' }}>{memberCount}</div>
          </div>
        </Card>

        {suspendedCount > 0 && (
          <Card style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #ef4444' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserX size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#b91c1c', textTransform: 'uppercase', fontWeight: '600' }}>Suspended</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#ef4444' }}>{suspendedCount}</div>
            </div>
          </Card>
        )}
      </div>

      {/* Main Table Card */}
      <Card style={{ overflow: 'hidden' }}>
        {/* Search & Filter Toolbar */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--color-surface)',
          }}
        >
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Search by name, email, enrollment, skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.6rem',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                fontSize: '0.875rem',
                outline: 'none',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                fontSize: '0.85rem',
                backgroundColor: '#ffffff',
                color: 'var(--color-secondary)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="LEAD">Domain Lead</option>
              <option value="MEMBER">Member</option>
            </select>

            {/* Domain Filter */}
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              style={{
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                fontSize: '0.85rem',
                backgroundColor: '#ffffff',
                color: 'var(--color-secondary)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">All Domains</option>
              <option value="NONE">No Domain / General</option>
              {domains.map((d) => (
                <option key={d.id || d._id} value={d.id || d._id}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                fontSize: '0.85rem',
                backgroundColor: '#ffffff',
                color: 'var(--color-secondary)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="SUSPENDED">Suspended Only</option>
            </select>

            {(searchTerm || roleFilter !== 'ALL' || domainFilter !== 'ALL' || statusFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('ALL');
                  setDomainFilter('ALL');
                  setStatusFilter('ALL');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  fontSize: '0.825rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: '0.4rem',
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div style={{ overflowX: 'auto' }}>
          {filteredUsers.length === 0 ? (
            <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <Users size={38} style={{ margin: '0 auto 0.75rem', opacity: 0.35 }} />
              <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-secondary)' }}>No users found</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {searchTerm || roleFilter !== 'ALL' || domainFilter !== 'ALL' || statusFilter !== 'ALL'
                  ? 'Try adjusting your search criteria or resetting filters.'
                  : 'Get started by clicking "+ Add New User".'}
              </p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.825rem', color: 'var(--color-text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                    User
                  </th>
                  <th style={{ padding: '1rem 1.25rem', fontSize: '0.825rem', color: 'var(--color-text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                    Role
                  </th>
                  <th style={{ padding: '1rem 1.25rem', fontSize: '0.825rem', color: 'var(--color-text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                    Domain
                  </th>
                  <th style={{ padding: '1rem 1.25rem', fontSize: '0.825rem', color: 'var(--color-text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                    Status
                  </th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.825rem', color: 'var(--color-text-muted)', fontWeight: '600', textTransform: 'uppercase', textAlign: 'right' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, i) => {
                  const userId = user.id || user._id;
                  return (
                    <tr
                      key={userId}
                      style={{
                        borderBottom: i === filteredUsers.length - 1 ? 'none' : '1px solid var(--color-border)',
                        backgroundColor: !user.isActive ? '#fffbfa' : 'transparent',
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      {/* Name & Account */}
                      <td style={{ padding: '1.125rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              backgroundColor: user.role === 'admin' ? '#ede9fe' : (user.role === 'lead' ? '#e0f2fe' : '#f1f5f9'),
                              color: user.role === 'admin' ? '#7c3aed' : (user.role === 'lead' ? '#0284c7' : '#475569'),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '700',
                              fontSize: '0.9rem',
                              flexShrink: 0,
                            }}
                          >
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ color: 'var(--color-secondary)', fontWeight: '600', fontSize: '0.95rem' }}>
                                {user.name}
                              </span>
                              {!user.isActive && (
                                <span style={{ fontSize: '0.7rem', backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1px 6px', borderRadius: '4px', fontWeight: '600' }}>
                                  Suspended
                                </span>
                              )}
                            </div>
                            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.825rem', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span>{user.email}</span>
                              {user.enrollmentNumber && (
                                <>
                                  <span>•</span>
                                  <span>ID: {user.enrollmentNumber}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role Dropdown / Badge */}
                      <td style={{ padding: '1.125rem 1.25rem' }}>
                        <select
                          value={user.role || 'member'}
                          onChange={(e) => handleQuickRoleChange(userId, e.target.value)}
                          style={{
                            padding: '0.35rem 0.6rem',
                            borderRadius: '6px',
                            border: '1px solid var(--color-border)',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            backgroundColor: user.role === 'admin' ? '#f5f3ff' : (user.role === 'lead' ? '#f0f9ff' : '#f8fafc'),
                            color: getRoleBadgeColor(user.role),
                            cursor: 'pointer',
                            outline: 'none',
                          }}
                        >
                          <option value="member">Member</option>
                          <option value="lead">Domain Lead</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>

                      {/* Domain */}
                      <td style={{ padding: '1.125rem 1.25rem' }}>
                        <Badge color="#64748b">{user.domain_name || user.domainName || 'General'}</Badge>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '1.125rem 1.25rem' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(user)}
                          title={`Click to ${user.isActive ? 'Suspend' : 'Activate'}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.3rem 0.65rem',
                            borderRadius: '20px',
                            border: 'none',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            backgroundColor: user.isActive ? '#dcfce7' : '#fee2e2',
                            color: user.isActive ? '#15803d' : '#b91c1c',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: user.isActive ? '#16a34a' : '#dc2626',
                            }}
                          />
                          {user.isActive ? 'Active' : 'Suspended'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '1.125rem 1.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                          {/* Edit Full Profile */}
                          <button
                            title="Edit User Profile & Settings"
                            onClick={() => setUserToEdit(user)}
                            style={{
                              background: '#ffffff',
                              border: '1px solid var(--color-border)',
                              borderRadius: '6px',
                              padding: '0.4rem 0.6rem',
                              cursor: 'pointer',
                              color: 'var(--color-secondary)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.8rem',
                              fontWeight: '500',
                            }}
                          >
                            <Edit3 size={14} /> Edit
                          </button>

                          {/* Reset Password */}
                          <button
                            title="Reset User Password"
                            onClick={() => setUserToResetPassword(user)}
                            style={{
                              background: '#fffbeb',
                              border: '1px solid #fde68a',
                              borderRadius: '6px',
                              padding: '0.4rem 0.5rem',
                              cursor: 'pointer',
                              color: '#d97706',
                              display: 'inline-flex',
                              alignItems: 'center',
                            }}
                          >
                            <KeyRound size={14} />
                          </button>

                          {/* Delete Account */}
                          <button
                            title="Delete User Account"
                            onClick={() => setDeleteTarget(user)}
                            style={{
                              background: '#fff1f2',
                              border: '1px solid #fecdd3',
                              borderRadius: '6px',
                              padding: '0.4rem 0.5rem',
                              cursor: 'pointer',
                              color: '#e11d48',
                              display: 'inline-flex',
                              alignItems: 'center',
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ManageUsers;
