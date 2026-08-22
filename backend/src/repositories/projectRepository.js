const { getDB } = require('../database/sqlite/connection');
const Project = require('../models/Project');

class ProjectRepository {
  async findAll() {
    const db = getDB();
    const rows = await db.all(`
      SELECT p.*, d.name as domain_name, u.name as lead_name
      FROM projects p
      LEFT JOIN domains d ON p.domain_id = d.id
      LEFT JOIN users u ON p.lead_id = u.id
      ORDER BY p.created_at DESC
    `);
    return rows.map(row => new Project(row));
  }

  async findById(id) {
    const db = getDB();
    const row = await db.get(`
      SELECT p.*, d.name as domain_name, u.name as lead_name
      FROM projects p
      LEFT JOIN domains d ON p.domain_id = d.id
      LEFT JOIN users u ON p.lead_id = u.id
      WHERE p.id = ?
    `, [id]);
    return row ? new Project(row) : null;
  }

  async findBySlug(slug) {
    const db = getDB();
    const row = await db.get(`
      SELECT p.*, d.name as domain_name, u.name as lead_name
      FROM projects p
      LEFT JOIN domains d ON p.domain_id = d.id
      LEFT JOIN users u ON p.lead_id = u.id
      WHERE p.slug = ?
    `, [slug]);
    return row ? new Project(row) : null;
  }

  async create(data) {
    const db = getDB();
    const teamMembersStr = data.teamMembers ? JSON.stringify(data.teamMembers) : '[]';
    const tagsStr = data.tags ? JSON.stringify(data.tags) : '[]';

    const result = await db.run(
      `INSERT INTO projects (
        title, slug, description, domain_id, lead_id, team_members, 
        status, github_url, live_url, tags, banner_image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.title, data.slug, data.description, data.domainId, data.leadId,
        teamMembersStr, data.status || 'PROPOSED', data.githubUrl, data.liveUrl,
        tagsStr, data.bannerImage
      ]
    );
    
    return this.findById(result.lastID);
  }

  async update(id, data) {
    const db = getDB();
    const teamMembersStr = data.teamMembers ? JSON.stringify(data.teamMembers) : null;
    const tagsStr = data.tags ? JSON.stringify(data.tags) : null;

    // Coalesce trick in sqlite update or just construct the query carefully
    // Since we pass the full parsed object back from Service in practice, we can just update all.
    await db.run(
      `UPDATE projects SET 
        title = ?, slug = ?, description = ?, domain_id = ?, lead_id = ?, 
        team_members = ?, status = ?, github_url = ?, live_url = ?, 
        tags = ?, banner_image = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        data.title, data.slug, data.description, data.domainId, data.leadId,
        teamMembersStr, data.status, data.githubUrl, data.liveUrl,
        tagsStr, data.bannerImage, id
      ]
    );

    return this.findById(id);
  }

  async delete(id) {
    const db = getDB();
    await db.run('DELETE FROM projects WHERE id = ?', [id]);
    return true;
  }
}

module.exports = new ProjectRepository();
