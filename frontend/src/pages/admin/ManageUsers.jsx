import React, { useState, useEffect } from 'react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Badge from '../../common/Badge';
import { Search, Plus, MoreVertical } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';

const ManageUsers = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/members')
      .then(setMembers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }}>Manage Users</h2>
        <Button variant="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
          <Plus size={16} /> Invite User
        </Button>
      </div>

      <Card style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search users by name or role..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }} 
            />
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Name</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Role</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Domain</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member, i) => (
                <tr key={member.id} style={{ borderBottom: i === filteredMembers.length - 1 ? 'none' : '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '0.875rem', fontWeight: 'bold' }}>
                        {member.name.charAt(0)}
                      </div>
                      <span style={{ color: 'var(--color-secondary)', fontWeight: '500' }}>{member.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <Badge color={member.role === 'lead' ? 'var(--color-primary)' : '#64748b'}>{member.role}</Badge>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-main)' }}>{member.domain_name || 'General'}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ManageUsers;
