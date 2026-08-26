import React, { useState, useEffect } from 'react';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import { Mail, MessageCircle, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../utils/apiClient';
import { useToast } from '../../context/ToastContext';

const MemberTeams = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    apiClient.get('/members')
      .then(setMembers)
      .catch((err) => toast.error(err.message || 'Failed to fetch team members'))
      .finally(() => setLoading(false));
  }, []);

  const peers = (members || []).filter(m => m.domain_id === user?.domainId || (!user?.domainId && m.domain_name === 'General') || user?.role === 'admin');
  const isLead = user?.role === 'lead' || user?.role === 'admin';

  if (loading) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', color: 'var(--color-text-muted)', textAlign: 'center', padding: '3rem' }}>
        Loading team members...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', color: 'var(--color-text-main)', fontWeight: 700, margin: 0 }}>
          {isLead ? 'Manage Domain Team' : 'My Domain Team'}
        </h2>
        <p style={{ color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          Connect with team members and technical specialists in your domain.
        </p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {peers.length > 0 ? peers.map((member) => (
          <Card key={member.id || member._id} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(220, 38, 38, 0.15)',
                border: '1px solid rgba(220, 38, 38, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary-hover)',
                flexShrink: 0,
                fontWeight: 'bold',
                fontSize: '1.15rem'
              }}>
                {member.name ? member.name.charAt(0).toUpperCase() : 'M'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--color-text-main)', margin: '0 0 0.2rem 0', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {member.name}
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', margin: '0 0 0.4rem 0', textTransform: 'capitalize', fontWeight: 500 }}>
                  {member.role || 'Member'}
                </p>
                <Badge color={member.role === 'lead' ? '#fb923c' : 'var(--color-primary)'}>
                  {member.domain_name || 'General'}
                </Badge>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <button
                  onClick={() => toast.info(`Emailing ${member.name} feature coming soon!`)}
                  style={{
                    border: '1px solid var(--color-border)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    cursor: 'pointer',
                    color: 'var(--color-text-muted)',
                    padding: '6px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                >
                  <Mail size={15} />
                </button>
                <button
                  onClick={() => toast.info(`Chat with ${member.name} feature coming soon!`)}
                  style={{
                    border: '1px solid var(--color-border)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    cursor: 'pointer',
                    color: 'var(--color-text-muted)',
                    padding: '6px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                >
                  <MessageCircle size={15} />
                </button>
              </div>
            </div>
            {isLead && (
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.85rem', marginTop: '0.25rem', display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={() => toast.info('Role management interface coming soon!')}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary-hover)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  Edit Member Role
                </button>
              </div>
            )}
          </Card>
        )) : (
           <p style={{ color: 'var(--color-text-muted)', padding: '2rem' }}>No members found in your domain.</p>
        )}
      </div>
    </div>
  );
};

export default MemberTeams;
