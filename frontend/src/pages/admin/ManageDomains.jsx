import React, { useState, useEffect } from 'react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Badge from '../../common/Badge';
import ConfirmModal from '../../common/ConfirmModal';
import CreateDomainModal from '../../components/admin/CreateDomainModal';
import { Plus, Trash2, Edit3, Layers, Code, Brain, Smartphone, Shield, Cloud, Database, Cpu, Globe, Terminal, Box } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';
import { useToast } from '../../context/ToastContext';

const getDomainIconComponent = (iconName) => {
  switch (iconName) {
    case 'Brain': return <Brain size={18} />;
    case 'Smartphone': return <Smartphone size={18} />;
    case 'Shield': return <Shield size={18} />;
    case 'Cloud': return <Cloud size={18} />;
    case 'Database': return <Database size={18} />;
    case 'Cpu': return <Cpu size={18} />;
    case 'Globe': return <Globe size={18} />;
    case 'Terminal': return <Terminal size={18} />;
    case 'Layers': return <Layers size={18} />;
    case 'Box': return <Box size={18} />;
    default: return <Code size={18} />;
  }
};

const ManageDomains = () => {
  const toast = useToast();
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [domainToEdit, setDomainToEdit] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDomains = () => {
    setLoading(true);
    apiClient.get('/domains')
      .then(setDomains)
      .catch((err) => toast.error(err.message || 'Failed to load domains'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await apiClient.delete(`/domains/${deleteTarget.id || deleteTarget._id}`);
      toast.success(`Domain "${deleteTarget.name}" deleted successfully.`);
      setDeleteTarget(null);
      fetchDomains();
    } catch (error) {
      toast.error(error.message || 'Failed to delete domain.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && domains.length === 0) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading domains...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Create / Edit Domain Modal */}
      {(showCreateModal || domainToEdit) && (
        <CreateDomainModal
          domainToEdit={domainToEdit}
          onClose={() => {
            setShowCreateModal(false);
            setDomainToEdit(null);
          }}
          onSuccess={() => {
            setShowCreateModal(false);
            setDomainToEdit(null);
            fetchDomains();
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Domain"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? All domain associations will be removed.`}
        confirmText="Delete Domain"
        confirmVariant="danger"
        loading={actionLoading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }}>Manage Domains</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Add, configure, and customize technical club domains and specializations.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem' }}
        >
          <Plus size={16} /> Create Domain
        </Button>
      </div>

      <Card style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          {domains.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <Layers size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
              <p style={{ fontWeight: 500 }}>No domains found.</p>
              <p style={{ fontSize: '0.875rem' }}>Click "Create Domain" to add your first domain.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Domain</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Slug</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Icon</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {domains.map((dom, i) => (
                  <tr key={dom.id || dom._id} style={{ borderBottom: i === domains.length - 1 ? 'none' : '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1.125rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            backgroundColor: '#eff6ff',
                            color: 'var(--color-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {getDomainIconComponent(dom.icon)}
                        </div>
                        <div>
                          <span style={{ color: 'var(--color-secondary)', fontWeight: '600', fontSize: '0.95rem' }}>{dom.name}</span>
                          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.2rem', maxWidth: '380px' }}>
                            {dom.description || 'No description provided.'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1.125rem 1.5rem' }}>
                      <Badge color="#64748b">{dom.slug}</Badge>
                    </td>
                    <td style={{ padding: '1.125rem 1.5rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                        {dom.icon || 'Code'}
                      </span>
                    </td>
                    <td style={{ padding: '1.125rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => setDomainToEdit(dom)}
                          style={{
                            background: 'none',
                            border: '1px solid var(--color-border)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: 'var(--color-secondary)',
                            padding: '6px 8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                          }}
                          title="Edit Domain"
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(dom)}
                          style={{
                            background: 'none',
                            border: '1px solid #fee2e2',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: '#dc2626',
                            padding: '6px 8px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          title="Delete Domain"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ManageDomains;
