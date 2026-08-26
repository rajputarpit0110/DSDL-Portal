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
        title: 'Domain Milestone ' + (achievements.length + 1),
        description: 'Completed cross-domain initiative and deployed production prototype.',
        date: new Date().toISOString().split('T')[0],
        category: 'Innovation Milestone',
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

  if (loading && achievements.length === 0) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', color: 'var(--color-text-muted)', textAlign: 'center', padding: '3rem' }}>
        Loading club milestones...
      </div>
    );
  }

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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--color-text-main)', fontWeight: 700, margin: 0 }}>
            Club Milestones & Awards
          </h2>
          <p style={{ color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
            Recognizing hackathon winners, research publications, and domain accomplishments.
          </p>
        </div>
        {isLead && (
          <Button variant="primary" onClick={handleAddNew} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1.15rem' }}>
            <Plus size={16} /> Log Milestone
          </Button>
        )}
      </div>

      <Card style={{ padding: '2rem', border: '1px solid var(--color-border)' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--color-text-main)', marginBottom: '1.5rem', fontWeight: 700 }}>
          Hall of Achievements
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {achievements.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>
              No milestones recorded yet. Check back after upcoming competitions!
            </p>
          ) : (
            achievements.map((achievement, i) => (
              <div
                key={achievement.id || achievement._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  borderBottom: i === achievements.length - 1 ? 'none' : '1px solid var(--color-border)',
                  paddingBottom: i === achievements.length - 1 ? '0' : '1.25rem'
                }}
              >
                <div style={{ display: 'flex', gap: '1.25rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.35)',
                    color: '#fbbf24',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Trophy size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--color-text-main)', margin: '0 0 0.25rem 0', fontWeight: 700 }}>
                      {achievement.title}
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-primary-hover)', fontWeight: 600 }}>
                      {achievement.category || 'Milestone'} • {achievement.date}
                    </span>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '0.4rem', lineHeight: 1.5 }}>
                      {achievement.description}
                    </p>
                  </div>
                </div>
                {isLead && (
                  <button
                    onClick={() => setDeleteTarget(achievement)}
                    style={{
                      background: 'none',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-muted)',
                      cursor: 'pointer',
                      padding: '6px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.15s ease'
                    }}
                    title="Delete milestone"
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = '#f87171';
                      e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = 'var(--color-text-muted)';
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default MemberAchievements;
