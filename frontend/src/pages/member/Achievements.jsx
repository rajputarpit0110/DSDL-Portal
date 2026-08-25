import React, { useState, useEffect } from 'react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import ConfirmModal from '../../common/ConfirmModal';
import { Plus, Trophy, Trash2 } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const MemberAchievements = () => {
  const toast = useToast();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { user } = useAuth();
  const isLead = user?.role === 'lead' || user?.role === 'admin';

  const fetchAchievements = () => {
    setLoading(true);
    apiClient.get('/achievements')
      .then(setAchievements)
      .catch((err) => toast.error(err.message || 'Failed to load achievements'))
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
        category: 'Milestone',
      });
      toast.success('New achievement recorded!');
      fetchAchievements();
    } catch (error) {
      toast.error(error.message || 'Error creating achievement. Do you have lead/admin privileges?');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await apiClient.delete(`/achievements/${deleteTarget.id || deleteTarget._id}`);
      toast.success('Achievement deleted.');
      setDeleteTarget(null);
      fetchAchievements();
    } catch (error) {
      toast.error(error.message || 'Failed to delete achievement.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && achievements.length === 0) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading achievements...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Achievement"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        confirmText="Delete"
        confirmVariant="danger"
        loading={actionLoading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

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
          {achievements.map((achievement) => (
            <div key={achievement.id || achievement._id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem' }}>
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
                <button
                  onClick={() => setDeleteTarget(achievement)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', height: 'fit-content' }}
                >
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
