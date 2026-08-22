const { getDB } = require('../database/sqlite/connection');
const Team = require('../models/Team');
const TeamRequest = require('../models/TeamRequest');

class TeamRepository {
  async findAll() {
    const db = getDB();
    const rows = await db.all(`
      SELECT t.*, d.name as domain_name, u.name as leader_name
      FROM teams t
      LEFT JOIN domains d ON t.domain_id = d.id
      LEFT JOIN users u ON t.leader_id = u.id
      ORDER BY t.created_at DESC
    `);
    return rows.map(row => new Team(row));
  }

  async findById(id) {
    const db = getDB();
    const row = await db.get(`
      SELECT t.*, d.name as domain_name, u.name as leader_name
      FROM teams t
      LEFT JOIN domains d ON t.domain_id = d.id
      LEFT JOIN users u ON t.leader_id = u.id
      WHERE t.id = ?
    `, [id]);
    return row ? new Team(row) : null;
  }

  async findBySlug(slug) {
    const db = getDB();
    const row = await db.get(`
      SELECT t.*, d.name as domain_name, u.name as leader_name
      FROM teams t
      LEFT JOIN domains d ON t.domain_id = d.id
      LEFT JOIN users u ON t.leader_id = u.id
      WHERE t.slug = ?
    `, [slug]);
    return row ? new Team(row) : null;
  }

  async create(data) {
    const db = getDB();
    const result = await db.run(
      `INSERT INTO teams (
        name, slug, description, domain_id, leader_id, status, max_members
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name, data.slug, data.description, data.domainId, 
        data.leaderId, data.status || 'active', data.maxMembers || 10
      ]
    );
    
    return this.findById(result.lastID);
  }

  async update(id, data) {
    const db = getDB();
    await db.run(
      `UPDATE teams SET 
        name = ?, slug = ?, description = ?, domain_id = ?, leader_id = ?, 
        status = ?, max_members = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        data.name, data.slug, data.description, data.domainId, data.leaderId,
        data.status, data.maxMembers, id
      ]
    );
    return this.findById(id);
  }

  async delete(id) {
    const db = getDB();
    await db.run('DELETE FROM teams WHERE id = ?', [id]);
    return true;
  }

  // Memberships
  async addMember(teamId, userId, role = 'MEMBER') {
    const db = getDB();
    await db.run(
      'INSERT INTO team_memberships (team_id, user_id, role) VALUES (?, ?, ?)',
      [teamId, userId, role]
    );
  }

  async removeMember(teamId, userId) {
    const db = getDB();
    await db.run(
      'DELETE FROM team_memberships WHERE team_id = ? AND user_id = ?',
      [teamId, userId]
    );
  }

  async getMembers(teamId) {
    const db = getDB();
    return await db.all(`
      SELECT tm.role, tm.joined_at, u.id as user_id, u.name, u.email
      FROM team_memberships tm
      JOIN users u ON tm.user_id = u.id
      WHERE tm.team_id = ?
    `, [teamId]);
  }

  async countMembers(teamId) {
    const db = getDB();
    const result = await db.get(
      'SELECT COUNT(*) as count FROM team_memberships WHERE team_id = ?',
      [teamId]
    );
    return result.count;
  }

  // Requests
  async createRequest(teamId, userId, message) {
    const db = getDB();
    await db.run(
      'INSERT INTO team_join_requests (team_id, user_id, message) VALUES (?, ?, ?)',
      [teamId, userId, message]
    );
  }

  async updateRequestStatus(teamId, userId, status) {
    const db = getDB();
    await db.run(
      'UPDATE team_join_requests SET status = ? WHERE team_id = ? AND user_id = ?',
      [status, teamId, userId]
    );
  }

  async getRequest(teamId, userId) {
    const db = getDB();
    const row = await db.get(
      'SELECT * FROM team_join_requests WHERE team_id = ? AND user_id = ?',
      [teamId, userId]
    );
    return row ? new TeamRequest(row) : null;
  }

  async getRequests(teamId) {
    const db = getDB();
    const rows = await db.all(`
      SELECT r.*, u.name as user_name
      FROM team_join_requests r
      JOIN users u ON r.user_id = u.id
      WHERE r.team_id = ?
    `, [teamId]);
    return rows.map(row => new TeamRequest(row));
  }
}

module.exports = new TeamRepository();
