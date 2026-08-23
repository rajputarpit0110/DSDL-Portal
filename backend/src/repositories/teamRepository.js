const Team = require('../models/Team');
const TeamMembership = require('../models/TeamMembership');
const TeamRequest = require('../models/TeamRequest');

class TeamRepository {
  async findAll() {
    const teams = await Team.find().populate('domainId').populate('leaderId').sort({ createdAt: -1 });
    return teams.map(t => this._mapWithRelations(t));
  }
  async findById(id) {
    const t = await Team.findById(id).populate('domainId').populate('leaderId');
    return t ? this._mapWithRelations(t) : null;
  }
  async findBySlug(slug) {
    const t = await Team.findOne({ slug }).populate('domainId').populate('leaderId');
    return t ? this._mapWithRelations(t) : null;
  }
  async create(data) { const t = new Team(data); await t.save(); return this.findById(t._id); }
  async update(id, data) { await Team.findByIdAndUpdate(id, data); return this.findById(id); }
  async delete(id) { await Team.findByIdAndDelete(id); return true; }
  _mapWithRelations(t) {
    const obj = t.toSafeObject();
    obj.domain_name = t.domainId ? t.domainId.name : null;
    obj.leader_name = t.leaderId ? t.leaderId.name : null;
    return obj;
  }
  
  async addMember(teamId, userId, role = 'MEMBER') { const tm = new TeamMembership({ teamId, userId, role }); await tm.save(); }
  async removeMember(teamId, userId) { await TeamMembership.findOneAndDelete({ teamId, userId }); }
  async getMembers(teamId) {
    const members = await TeamMembership.find({ teamId }).populate('userId', 'name email');
    return members.map(m => ({
      role: m.role, joined_at: m.joinedAt, user_id: m.userId.id, name: m.userId.name, email: m.userId.email
    }));
  }
  async countMembers(teamId) { return await TeamMembership.countDocuments({ teamId }); }
  
  async createRequest(teamId, userId, message) { const req = new TeamRequest({ teamId, userId, message }); await req.save(); }
  async updateRequestStatus(teamId, userId, status) { await TeamRequest.findOneAndUpdate({ teamId, userId }, { status }); }
  async getRequest(teamId, userId) { return await TeamRequest.findOne({ teamId, userId }); }
  async getRequests(teamId) {
    const reqs = await TeamRequest.find({ teamId }).populate('userId', 'name');
    return reqs.map(r => { const obj = r.toSafeObject(); obj.user_name = r.userId ? r.userId.name : null; return obj; });
  }
}
module.exports = new TeamRepository();