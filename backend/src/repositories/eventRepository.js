const { getDB } = require('../database/sqlite/connection');
const Event = require('../models/Event');

class EventRepository {
  async findAll(publishedOnly = true) {
    const db = getDB();
    let query = 'SELECT * FROM events';
    const params = [];
    
    if (publishedOnly) {
      query += " WHERE status = 'published'";
    }
    
    query += ' ORDER BY date DESC';
    
    const rows = await db.all(query, params);
    return rows.map(row => new Event(row));
  }

  async findById(id) {
    const db = getDB();
    const row = await db.get('SELECT * FROM events WHERE id = ?', [id]);
    return row ? new Event(row) : null;
  }

  async findBySlug(slug) {
    const db = getDB();
    const row = await db.get('SELECT * FROM events WHERE slug = ?', [slug]);
    return row ? new Event(row) : null;
  }

  async create(data) {
    const db = getDB();
    
    const result = await db.run(
      `INSERT INTO events (
        title, slug, description, type, date, start_time, end_time, 
        venue, online_link, organizer_id, registration_deadline, 
        max_participants, registration_required, status, banner_image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.title, data.slug, data.description, data.type, data.date,
        data.startTime, data.endTime, data.venue, data.onlineLink,
        data.organizerId, data.registrationDeadline, data.maxParticipants,
        data.registrationRequired ? 1 : 0, data.status || 'draft', data.bannerImage
      ]
    );
    
    return this.findById(result.lastID);
  }

  async update(id, data) {
    const db = getDB();
    
    await db.run(
      `UPDATE events SET 
        title = ?, slug = ?, description = ?, type = ?, date = ?, 
        start_time = ?, end_time = ?, venue = ?, online_link = ?, 
        organizer_id = ?, registration_deadline = ?, max_participants = ?, 
        registration_required = ?, status = ?, banner_image = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        data.title, data.slug, data.description, data.type, data.date,
        data.startTime, data.endTime, data.venue, data.onlineLink,
        data.organizerId, data.registrationDeadline, data.maxParticipants,
        data.registrationRequired ? 1 : 0, data.status, data.bannerImage,
        id
      ]
    );

    return this.findById(id);
  }

  async delete(id) {
    const db = getDB();
    await db.run('DELETE FROM events WHERE id = ?', [id]);
    return true;
  }
}

module.exports = new EventRepository();
