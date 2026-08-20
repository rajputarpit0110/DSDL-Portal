import React from 'react';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import { mockMembers } from '../../data/mockMembers';
import { Mail, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MemberTeams = () => {
  const { user } = useAuth();
  
  // Mock filtering peers by user's domain, fallback to all if no domain matched
  const peers = mockMembers.filter(m => m.domain === (user?.domain || 'App Development')) || mockMembers;
  const isLead = user?.role === 'lead';

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }}>
          {isLead ? 'Manage Domain Team' : 'My Domain Team'}
        </h2>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {peers.length > 0 ? peers.map(member => (
          <Card key={member.id} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', flexShrink: 0 }}>
                {member.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--color-secondary)' }}>{member.name}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{member.role}</p>
                <Badge color="var(--color-primary)">{member.domain}</Badge>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-muted)' }}><Mail size={18} /></button>
                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-muted)' }}><MessageCircle size={18} /></button>
              </div>
            </div>
            {isLead && (
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                <button style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.875rem', cursor: 'pointer' }}>Edit Member Role</button>
              </div>
            )}
          </Card>
        )) : (
           <p style={{ color: 'var(--color-text-muted)' }}>No members found in your domain.</p>
        )}
      </div>
    </div>
  );
};

export default MemberTeams;
