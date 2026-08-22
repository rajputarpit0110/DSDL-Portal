const { getDB } = require('../database/sqlite/connection');
const EventRegistration = require('../models/EventRegistration');

class RegistrationRepository {
  async getRegistrationsForEvent(eventId) {
    const db = getDB();
    const rows = await db.all(`
      SELECT er.*, u.name as user_name, u.email as user_email
      FROM event_registrations er
      JOIN users u ON er.user_id = u.id
      WHERE er.event_id = ?
      ORDER BY er.registered_at DESC
    `, [eventId]);
    return rows.map(row => new EventRegistration(row));
  }

  async getRegistration(eventId, userId) {
    const db = getDB();
    const row = await db.get(
      'SELECT * FROM event_registrations WHERE event_id = ? AND user_id = ?',
      [eventId, userId]
    );
    return row ? new EventRegistration(row) : null;
  }

  async countEventRegistrations(eventId) {
    const db = getDB();
    const result = await db.get(
      'SELECT COUNT(*) as count FROM event_registrations WHERE event_id = ? AND status != ?',
      [eventId, 'CANCELLED']
    );
    return result.count;
  }

  async create(eventId, userId, status = 'REGISTERED') {
    const db = getDB();
    await db.run(
      'INSERT INTO event_registrations (event_id, user_id, status) VALUES (?, ?, ?)',
      [eventId, userId, status]
    );
    return this.getRegistration(eventId, userId);
  }
}

module.exports = new RegistrationRepository();
