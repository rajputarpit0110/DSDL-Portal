const { getDB } = require('../database/sqlite/connection');
const Domain = require('../models/Domain');

class DomainRepository {
  async findAll() {
    const db = getDB();
    const rows = await db.all('SELECT * FROM domains ORDER BY name ASC');
    return rows.map(row => new Domain(row));
  }

  async findById(id) {
    const db = getDB();
    const row = await db.get('SELECT * FROM domains WHERE id = ?', [id]);
    return row ? new Domain(row) : null;
  }

  async findBySlug(slug) {
    const db = getDB();
    const row = await db.get('SELECT * FROM domains WHERE slug = ?', [slug]);
    return row ? new Domain(row) : null;
  }

  async create(domainData) {
    const db = getDB();
    const { name, slug, description, icon, imageUrl, leadId } = domainData;
    
    const result = await db.run(
      `INSERT INTO domains (name, slug, description, icon, image_url, lead_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, slug, description, icon, imageUrl, leadId]
    );
    
    return this.findById(result.lastID);
  }

  async update(id, domainData) {
    const db = getDB();
    const { name, slug, description, icon, imageUrl, leadId } = domainData;

    await db.run(
      `UPDATE domains SET 
        name = ?, slug = ?, description = ?, icon = ?, image_url = ?, lead_id = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, slug, description, icon, imageUrl, leadId, id]
    );

    return this.findById(id);
  }

  async delete(id) {
    const db = getDB();
    await db.run('DELETE FROM domains WHERE id = ?', [id]);
    return true;
  }
}

module.exports = new DomainRepository();
