const { getDB } = require('../database/sqlite/connection');
const Announcement = require('../models/Announcement');

class AnnouncementRepository {
  async findAllPublic() {
    const db = getDB();
    const rows = await db.all(`
      SELECT * FROM announcements 
      WHERE status = 'published' 
      AND (expires_at IS NULL OR expires_at > datetime('now'))
      ORDER BY 
        CASE priority 
          WHEN 'URGENT' THEN 1 
          WHEN 'HIGH' THEN 2 
          WHEN 'NORMAL' THEN 3 
          WHEN 'LOW' THEN 4 
        END,
        published_at DESC
    `);
    return rows.map(row => new Announcement(row));
  }

  async findAll() {
    const db = getDB();
    const rows = await db.all('SELECT * FROM announcements ORDER BY created_at DESC');
    return rows.map(row => new Announcement(row));
  }

  async findById(id) {
    const db = getDB();
    const row = await db.get('SELECT * FROM announcements WHERE id = ?', [id]);
    return row ? new Announcement(row) : null;
  }

  async findBySlug(slug) {
    const db = getDB();
    const row = await db.get('SELECT * FROM announcements WHERE slug = ?', [slug]);
    return row ? new Announcement(row) : null;
  }

  async create(data) {
    const db = getDB();
    const result = await db.run(
      `INSERT INTO announcements (
        title, slug, content, summary, type, priority, author_id, 
        status, published_at, expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.title, data.slug, data.content, data.summary, data.type, 
        data.priority, data.authorId, data.status || 'draft', 
        data.publishedAt, data.expiresAt
      ]
    );
    return this.findById(result.lastID);
  }

  async update(id, data) {
    const db = getDB();
    await db.run(
      `UPDATE announcements SET 
        title = ?, slug = ?, content = ?, summary = ?, type = ?, 
        priority = ?, status = ?, published_at = ?, expires_at = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        data.title, data.slug, data.content, data.summary, data.type, 
        data.priority, data.status, data.publishedAt, data.expiresAt, id
      ]
    );
    return this.findById(id);
  }

  async delete(id) {
    const db = getDB();
    await db.run('DELETE FROM announcements WHERE id = ?', [id]);
    return true;
  }
}

module.exports = new AnnouncementRepository();
