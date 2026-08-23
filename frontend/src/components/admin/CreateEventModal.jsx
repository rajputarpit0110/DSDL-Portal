import React, { useState } from 'react';
import { apiClient } from '../../utils/apiClient';

const CreateEventModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ title: '', type: 'WORKSHOP', date: '', venue: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/events', formData);
      onSuccess();
    } catch (err) {
      console.error(err);
      alert('Failed to create event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '400px' }}>
        <h3>Create New Event</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <input required placeholder="Event Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ padding: '0.5rem' }} />
          <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ padding: '0.5rem' }}>
            <option value="WORKSHOP">Workshop</option>
            <option value="HACKATHON">Hackathon</option>
            <option value="MEETUP">Meetup</option>
          </select>
          <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} style={{ padding: '0.5rem' }} />
          <input placeholder="Venue" value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} style={{ padding: '0.5rem' }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.5rem 1rem' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px' }}>{loading ? 'Creating...' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
