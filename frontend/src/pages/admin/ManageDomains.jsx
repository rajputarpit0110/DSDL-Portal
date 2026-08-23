import React, { useState, useEffect } from 'react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Badge from '../../common/Badge';
import { Plus, Trash2 } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';

const ManageDomains = () => {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDomains = () => {
    setLoading(true);
    apiClient.get('/domains')
      .then(setDomains)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this domain?')) {
      try {
        await apiClient.delete(`/domains/${id}`);
        fetchDomains();
      } catch (error) {
        console.error('Failed to delete domain:', error);
      }
    }
  };

  const handleCreateMock = async () => {
    try {
      await apiClient.post('/domains', {
        name: 'New Domain ' + Math.floor(Math.random() * 100),
        description: 'A new domain created from the dashboard.',
        icon: 'Box'
      });
      fetchDomains();
    } catch (error) {
      console.error('Failed to create domain:', error);
    }
  };

  if (loading && domains.length === 0) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }}>Manage Domains</h2>
        <Button variant="primary" onClick={handleCreateMock} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
          <Plus size={16} /> Create Domain
        </Button>
      </div>

      <Card style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          {domains.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No domains found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Name</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Slug</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {domains.map((dom, i) => (
                  <tr key={dom.id || dom._id} style={{ borderBottom: i === domains.length - 1 ? 'none' : '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ color: 'var(--color-secondary)', fontWeight: '500' }}>{dom.name}</span>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{dom.description}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <Badge color="#64748b">{dom.slug}</Badge>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <button onClick={() => handleDelete(dom.id || dom._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                        <Trash2 size={18} />
                      </button>
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
