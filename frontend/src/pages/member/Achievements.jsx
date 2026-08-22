import React, { useState, useEffect } from 'react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import { Plus, Trophy, Trash2 } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';
import { useAuth } from '../../context/AuthContext';

const MemberAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isLead = user?.role === 'lead' || user?.role === 'admin';

  const fetchAchievements = () => {
    setLoading(true);
    apiClient.get('/achievements')
      .then(setAchievements)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleAddNew = async () => {
    try {
      await apiClient.post('/achievements', {
        title: 'New Milestone ' + Date.now(),
        description: 'We achieved something great today!',
        date: new Date().toISOString().split('T')[0],
        category: 'Milestone'
      });
      fetchAchievements();
    } catch (error) {
      console.error('Failed to create achievement', error);
      alert('Error creating achievement. Do you have lead/admin privileges?');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this achievement?')) {
      try {
        await apiClient.delete(`/achievements/${id}`);
        fetchAchievements();
      } catch (error) {
        console.error('Failed to delete', error);
      }
    }
  };

  if (loading && achievements.length === 0) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }}>Log Achievement</h2>
        {isLead && (
          <Button variant="primary" onClick={handleAddNew} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
            <Plus size={16} /> Add Mock
          </Button>
        )}
      </div>

      <Card style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', color: 'var(--color-secondary)', marginBottom: '1.5rem' }}>Recent Club Achievements</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {achievements.map(achievement => (
            <div key={achievement.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                 <div style={{ color: '#d97706', marginTop: '0.25rem' }}>
                   <Trophy size={20} />
                 </div>
                 <div>
                   <h4 style={{ fontSize: '1rem', color: 'var(--color-secondary)' }}>{achievement.title}</h4>
                   <span style={{ fontSize: '0.875rem', color: 'var(--color-primary)' }}>{achievement.category} • {achievement.date}</span>
                   <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-main)', marginTop: '0.5rem' }}>{achievement.description}</p>
                 </div>
              </div>
              {isLead && (
                <button onClick={() => handleDelete(achievement.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', height: 'fit-content' }}>
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MemberAchievements;
