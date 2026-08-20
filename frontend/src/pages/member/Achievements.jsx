import React from 'react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import { mockAchievements } from '../../data/mockAchievements';
import { Plus, Trophy } from 'lucide-react';

const MemberAchievements = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }}>Log Achievement</h2>
        <Button variant="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
          <Plus size={16} /> Add New
        </Button>
      </div>

      <Card style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', color: 'var(--color-secondary)', marginBottom: '1.5rem' }}>Recent Club Achievements</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {mockAchievements.map(achievement => (
            <div key={achievement.id} style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem' }}>
               <div style={{ color: '#d97706', marginTop: '0.25rem' }}>
                 <Trophy size={20} />
               </div>
               <div>
                 <h4 style={{ fontSize: '1rem', color: 'var(--color-secondary)' }}>{achievement.title}</h4>
                 <span style={{ fontSize: '0.875rem', color: 'var(--color-primary)' }}>{achievement.category} • {achievement.year}</span>
                 <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-main)', marginTop: '0.5rem' }}>{achievement.description}</p>
               </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MemberAchievements;
