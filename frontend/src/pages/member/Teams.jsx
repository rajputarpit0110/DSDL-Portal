import React, { useState, useEffect } from 'react';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import { Mail, MessageCircle } from 'lucide-react';
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

  const peers = members.filter(m => m.domain_id === user?.domainId || (!user?.domainId && m.domain_name === 'General') || user?.role === 'admin');
  const isLead = user?.role === 'lead' || user?.role === 'admin';

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading team members...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }}>
          {isLead ? 'Manage Domain Team' : 'My Domain Team'}
        </h2>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {peers.length > 0 ? peers.map(member => (
          <Card key={member.id || member._id} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>
                {member.name ? member.name.charAt(0).toUpperCase() : 'M'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--color-secondary)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.name}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.4rem', textTransform: 'capitalize' }}>{member.role || 'Member'}</p>
                <Badge color="var(--color-primary)">{member.domain_name || 'General'}</Badge>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={() => toast.info(`Emailing ${member.name} feature coming soon!`)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '4px' }}
                >
                  <Mail size={18} />
                </button>
                <button
                  onClick={() => toast.info(`Chat with ${member.name} feature coming soon!`)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '4px' }}
                >
                  <MessageCircle size={18} />
                </button>
              </div>
            </div>
            {isLead && (
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={() => toast.info('Role management interface coming soon!')}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500 }}
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
