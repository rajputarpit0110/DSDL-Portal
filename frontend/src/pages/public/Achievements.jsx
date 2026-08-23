import React from 'react';
import Container from '../../common/Container';
import SectionHeading from '../../common/SectionHeading';
import Card from '../../common/Card';
import { mockAchievements } from '../../data/mockAchievements';
import { Trophy } from 'lucide-react';

const Achievements = () => {
  return (
    <div style={{ padding: '6rem 2rem' }}>
      <Container>
        <SectionHeading title='Our Achievements' subtitle='Celebrating the success of DSDL members in national and global arenas.' />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
          {mockAchievements.map(achievement => (
            <Card key={achievement.id} style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#fef3c7', color: '#d97706', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Trophy size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--color-secondary)' }}>{achievement.title}</h3>
                  <span style={{ fontSize: '0.875rem', backgroundColor: 'var(--color-surface)', padding: '0.25rem 0.75rem', borderRadius: '9999px', color: 'var(--color-text-muted)' }}>{achievement.year || (achievement.date ? new Date(achievement.date).getFullYear() : '')}</span>
                </div>
                <span style={{ display: 'inline-block', fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: '500', marginBottom: '1rem' }}>{achievement.category}</span>
                <p style={{ color: 'var(--color-text-main)', lineHeight: '1.6' }}>{achievement.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Achievements;
