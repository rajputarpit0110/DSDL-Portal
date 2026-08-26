import React, { useState, useEffect } from 'react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Badge from '../../common/Badge';
import { Search, Plus, MoreVertical, UserCheck } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';
import AddMemberModal from '../../components/admin/AddMemberModal';

const ManageUsers = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const fetchMembers = () => {
    setLoading(true);
    apiClient.get('/members')
      .then(setMembers)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = (members || []).filter(m => 
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role) => {
    if (role === 'admin') return 'var(--color-primary)';
    if (role === 'lead') return '#fb923c';
    return '#34d399';
  };

  if (loading && members.length === 0) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', color: 'var(--color-text-muted)', textAlign: 'center', padding: '3rem' }}>
        Loading members directory...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {showAdd && (
        <AddMemberModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => {
            setShowAdd(false);
            fetchMembers();
          }}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--color-text-main)', fontWeight: 700, margin: 0 }}>
            Manage Users
          </h2>
          <p style={{ color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
            View and administer portal accounts, leads, and club members.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1.15rem' }}>
          <Plus size={16} /> Add Member
        </Button>
      </div>

      <Card style={{ overflow: 'hidden', padding: 0 }}>
        {/* Search header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
          <div style={{ position: 'relative', maxWidth: '400px' }}>
            <Search size={17} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search members by name, email, or role..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.6rem',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                color: 'var(--color-text-main)',
                fontSize: '0.875rem',
                outline: 'none'
              }} 
            />
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Name & Email</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Role</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Domain</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    No members match "{searchTerm}".
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member, i) => (
                  <tr
                    key={member.id || i}
                    style={{
                      borderBottom: i === filteredMembers.length - 1 ? 'none' : '1px solid var(--color-border)',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(220, 38, 38, 0.12)',
                          border: '1px solid rgba(220, 38, 38, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--color-primary-hover)',
                          fontSize: '0.875rem',
                          fontWeight: 'bold',
                          flexShrink: 0
                        }}>
                          {member.name ? member.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div style={{ color: 'var(--color-text-main)', fontWeight: 600, fontSize: '0.925rem' }}>
                            {member.name}
                          </div>
                          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <Badge color={getRoleColor(member.role)}>{member.role}</Badge>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-main)', fontSize: '0.9rem' }}>
                      {member.domain_name || 'General'}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--color-text-muted)',
                          padding: '0.35rem',
                          borderRadius: '4px',
                          transition: 'color 0.15s'
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.color = '#ffffff')}
                        onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                      >
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ManageUsers;
