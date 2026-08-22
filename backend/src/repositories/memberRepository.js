const { getDB } = require('../database/sqlite/connection');
const MemberProfile = require('../models/MemberProfile');
const User = require('../models/User');

class MemberRepository {
  async findProfileByUserId(userId) {
    const db = getDB();
    const row = await db.get('SELECT * FROM member_profiles WHERE user_id = ?', [userId]);
    return row ? new MemberProfile(row) : null;
  }

  async getCombinedMemberData(userId) {
    const db = getDB();
    const row = await db.get(`
      SELECT u.*, mp.profile_photo, mp.phone, mp.domain_id, mp.skills, mp.bio, mp.github, mp.linkedin, mp.joining_date, mp.visibility, d.name as domain_name
      FROM users u
      LEFT JOIN member_profiles mp ON u.id = mp.user_id
      LEFT JOIN domains d ON mp.domain_id = d.id
      WHERE u.id = ?
    `, [userId]);

    if (!row) return null;

    const user = new User(row).toSafeObject();
    const profile = new MemberProfile({
      user_id: row.id,
      profile_photo: row.profile_photo,
      phone: row.phone,
      branch: row.branch,
      year: row.year,
      domain_id: row.domain_id,
      skills: row.skills,
      bio: row.bio,
      github: row.github,
      linkedin: row.linkedin,
      joining_date: row.joining_date,
      visibility: row.visibility
    });

    return { user, profile, domainName: row.domain_name };
  }

  async findAllPublic(limit = 10, offset = 0) {
    const db = getDB();
    const rows = await db.all(`
      SELECT u.id, u.name, mp.profile_photo, mp.bio, d.name as domain_name
      FROM users u
      LEFT JOIN member_profiles mp ON u.id = mp.user_id
      LEFT JOIN domains d ON mp.domain_id = d.id
      WHERE (mp.visibility = 'public' OR mp.visibility IS NULL) AND u.is_active = 1
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);
    return rows;
  }

  async upsertProfile(userId, profileData) {
    const db = getDB();
    const { profilePhoto, phone, branch, year, domainId, skills, bio, github, linkedin, visibility } = profileData;
    const skillsString = skills ? JSON.stringify(skills) : null;

    // We use a simple SELECT to check if exists, then INSERT or UPDATE for SQLite compatibility without modern upsert features
    const exists = await this.findProfileByUserId(userId);
    
    if (exists) {
      await db.run(
        `UPDATE member_profiles SET 
          profile_photo = ?, phone = ?, branch = ?, year = ?, domain_id = ?, skills = ?, bio = ?, github = ?, linkedin = ?, visibility = ?
         WHERE user_id = ?`,
        [profilePhoto, phone, branch, year, domainId, skillsString, bio, github, linkedin, visibility, userId]
      );
    } else {
      await db.run(
        `INSERT INTO member_profiles (user_id, profile_photo, phone, branch, year, domain_id, skills, bio, github, linkedin, visibility)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, profilePhoto, phone, branch, year, domainId, skillsString, bio, github, linkedin, visibility]
      );
    }

    return this.findProfileByUserId(userId);
  }
}

module.exports = new MemberRepository();
