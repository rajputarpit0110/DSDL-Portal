import React, { useState, useEffect } from 'react';
import Container from '../../common/Container';
import SectionHeading from '../../common/SectionHeading';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import { apiClient } from '../../utils/apiClient';
import { GitBranch, Globe } from 'lucide-react';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/members')
      .then(setMembers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ padding: '6rem 2rem', backgroundColor: 'var(--color-surface)' }}>
      <Container>
        <SectionHeading title='Core Team' subtitle='Meet the people behind KRIVA.' />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {members.map(member => (
            <Card key={member.id} style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '96px', height: '96px', borderRadius: '50%', backgroundColor: 'var(--color-border)', margin: '0 auto 1.5rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '2rem', fontWeight: 'bold' }}>
                {member.name.charAt(0)}
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-secondary)', marginBottom: '0.25rem' }}>{member.name}</h3>
              <p style={{ color: 'var(--color-primary)', fontWeight: '500', fontSize: '0.9375rem', marginBottom: '1rem' }}>{member.role}</p>
              <Badge color='var(--color-text-muted)'>{member.domain_name || 'General'}</Badge>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                {member.github && <a href={member.github} style={{ color: 'var(--color-text-muted)' }}><GitBranch size={20} /></a>}
                {member.linkedin && <a href={member.linkedin} style={{ color: 'var(--color-text-muted)' }}><Globe size={20} /></a>}
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Members;
