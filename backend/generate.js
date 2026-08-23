const fs = require('fs');
const path = require('path');

const modelsDir = path.join('src', 'models');
const reposDir = path.join('src', 'repositories');

if (!fs.existsSync(modelsDir)) fs.mkdirSync(modelsDir, { recursive: true });
if (!fs.existsSync(reposDir)) fs.mkdirSync(reposDir, { recursive: true });

const write = (dir, name, content) => fs.writeFileSync(path.join(dir, name), content.trim());

// MODELS
write(modelsDir, 'User.js', `
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  enrollmentNumber: String,
  branch: String,
  year: Number,
  role: { type: String, default: 'member' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
userSchema.methods.toSafeObject = function() {
  const obj = this.toObject({ virtuals: true });
  delete obj.passwordHash; delete obj._id; delete obj.__v;
  return obj;
};
module.exports = mongoose.model('User', userSchema);
`);

write(modelsDir, 'MemberProfile.js', `
const mongoose = require('mongoose');
const memberProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  profilePhoto: String,
  phone: String,
  branch: String,
  year: Number,
  domainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain' },
  skills: [String],
  bio: String,
  github: String,
  linkedin: String,
  joiningDate: { type: Date, default: Date.now },
  visibility: { type: String, default: 'public' }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
memberProfileSchema.methods.toSafeObject = function() {
  const obj = this.toObject({ virtuals: true });
  delete obj._id; delete obj.__v;
  return obj;
};
module.exports = mongoose.model('MemberProfile', memberProfileSchema);
`);

write(modelsDir, 'Domain.js', `
const mongoose = require('mongoose');
const domainSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  icon: String,
  imageUrl: String,
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
domainSchema.methods.toSafeObject = function() {
  const obj = this.toObject({ virtuals: true });
  delete obj._id; delete obj.__v;
  return obj;
};
module.exports = mongoose.model('Domain', domainSchema);
`);

write(modelsDir, 'Event.js', `
const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  type: { type: String, required: true },
  date: Date,
  startTime: String,
  endTime: String,
  venue: String,
  onlineLink: String,
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  registrationDeadline: Date,
  maxParticipants: Number,
  registrationRequired: { type: Boolean, default: false },
  status: { type: String, default: 'draft' },
  bannerImage: String
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
eventSchema.methods.toSafeObject = function() {
  const obj = this.toObject({ virtuals: true });
  delete obj._id; delete obj.__v;
  return obj;
};
module.exports = mongoose.model('Event', eventSchema);
`);

write(modelsDir, 'EventRegistration.js', `
const mongoose = require('mongoose');
const eventRegistrationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'REGISTERED' },
  registeredAt: { type: Date, default: Date.now }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
eventRegistrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });
eventRegistrationSchema.methods.toSafeObject = function() {
  const obj = this.toObject({ virtuals: true });
  delete obj._id; delete obj.__v;
  return obj;
};
module.exports = mongoose.model('EventRegistration', eventRegistrationSchema);
`);

write(modelsDir, 'Announcement.js', `
const mongoose = require('mongoose');
const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  summary: String,
  type: { type: String, default: 'NEWS' },
  priority: { type: String, default: 'NORMAL' },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'draft' },
  publishedAt: Date,
  expiresAt: Date
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
announcementSchema.methods.toSafeObject = function() {
  const obj = this.toObject({ virtuals: true });
  delete obj._id; delete obj.__v;
  return obj;
};
module.exports = mongoose.model('Announcement', announcementSchema);
`);

write(modelsDir, 'Project.js', `
const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  domainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain' },
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  teamMembers: [String],
  status: { type: String, default: 'PROPOSED' },
  githubUrl: String,
  liveUrl: String,
  tags: [String],
  bannerImage: String
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
projectSchema.methods.toSafeObject = function() {
  const obj = this.toObject({ virtuals: true });
  delete obj._id; delete obj.__v;
  return obj;
};
module.exports = mongoose.model('Project', projectSchema);
`);

write(modelsDir, 'Team.js', `
const mongoose = require('mongoose');
const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  domainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain' },
  leaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'active' },
  maxMembers: { type: Number, default: 10 }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
teamSchema.methods.toSafeObject = function() {
  const obj = this.toObject({ virtuals: true });
  delete obj._id; delete obj.__v;
  return obj;
};
module.exports = mongoose.model('Team', teamSchema);
`);

write(modelsDir, 'TeamMembership.js', `
const mongoose = require('mongoose');
const teamMembershipSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, default: 'MEMBER' },
  joinedAt: { type: Date, default: Date.now }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
teamMembershipSchema.index({ teamId: 1, userId: 1 }, { unique: true });
teamMembershipSchema.methods.toSafeObject = function() {
  const obj = this.toObject({ virtuals: true });
  delete obj._id; delete obj.__v;
  return obj;
};
module.exports = mongoose.model('TeamMembership', teamMembershipSchema);
`);

write(modelsDir, 'TeamRequest.js', `
const mongoose = require('mongoose');
const teamRequestSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'PENDING' },
  message: String,
  requestedAt: { type: Date, default: Date.now }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
teamRequestSchema.index({ teamId: 1, userId: 1 }, { unique: true });
teamRequestSchema.methods.toSafeObject = function() {
  const obj = this.toObject({ virtuals: true });
  delete obj._id; delete obj.__v;
  return obj;
};
module.exports = mongoose.model('TeamRequest', teamRequestSchema);
`);

write(modelsDir, 'Achievement.js', `
const mongoose = require('mongoose');
const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: String,
  category: String
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
achievementSchema.methods.toSafeObject = function() {
  const obj = this.toObject({ virtuals: true });
  delete obj._id; delete obj.__v;
  return obj;
};
module.exports = mongoose.model('Achievement', achievementSchema);
`);

// REPOSITORIES
write(reposDir, 'userRepository.js', `
const User = require('../models/User');

class UserRepository {
  async findByEmail(email) { return await User.findOne({ email: email.toLowerCase() }); }
  async findById(id) { return await User.findById(id); }
  async create(userData) {
    const { name, email, passwordHash, enrollmentNumber, branch, year, role } = userData;
    const user = new User({ name, email: email.toLowerCase(), passwordHash, enrollmentNumber, branch, year, role: role || 'member' });
    return await user.save();
  }
}
module.exports = new UserRepository();
`);

write(reposDir, 'memberRepository.js', `
const MemberProfile = require('../models/MemberProfile');
const User = require('../models/User');

class MemberRepository {
  async findProfileByUserId(userId) {
    return await MemberProfile.findOne({ userId });
  }
  async getCombinedMemberData(userId) {
    const userDoc = await User.findById(userId);
    if (!userDoc) return null;
    const profileDoc = await MemberProfile.findOne({ userId }).populate('domainId', 'name');
    
    return { 
      user: userDoc.toSafeObject(), 
      profile: profileDoc ? profileDoc.toSafeObject() : null, 
      domainName: profileDoc && profileDoc.domainId ? profileDoc.domainId.name : null 
    };
  }
  async findAllPublic(limit = 10, offset = 0) {
    const profiles = await MemberProfile.find({ visibility: { $in: ['public', null] } })
      .populate({ path: 'userId', select: 'id name isActive createdAt', match: { isActive: true } })
      .populate('domainId', 'name')
      .skip(offset).limit(limit)
      .sort({ createdAt: -1 });

    return profiles.filter(p => p.userId).map(p => ({
      id: p.userId.id,
      name: p.userId.name,
      profilePhoto: p.profilePhoto,
      bio: p.bio,
      domain_name: p.domainId ? p.domainId.name : null
    }));
  }
  async upsertProfile(userId, profileData) {
    const { profilePhoto, phone, branch, year, domainId, skills, bio, github, linkedin, visibility } = profileData;
    return await MemberProfile.findOneAndUpdate(
      { userId },
      { profilePhoto, phone, branch, year, domainId, skills, bio, github, linkedin, visibility },
      { new: true, upsert: true }
    );
  }
}
module.exports = new MemberRepository();
`);

write(reposDir, 'domainRepository.js', `
const Domain = require('../models/Domain');

class DomainRepository {
  async findAll() { return await Domain.find().sort({ createdAt: -1 }); }
  async findById(id) { return await Domain.findById(id); }
  async findBySlug(slug) { return await Domain.findOne({ slug }); }
  async create(data) { const domain = new Domain(data); return await domain.save(); }
  async update(id, data) { return await Domain.findByIdAndUpdate(id, data, { new: true }); }
  async delete(id) { await Domain.findByIdAndDelete(id); return true; }
}
module.exports = new DomainRepository();
`);

write(reposDir, 'eventRepository.js', `
const Event = require('../models/Event');

class EventRepository {
  async findAll(publishedOnly = true) {
    const query = publishedOnly ? { status: 'published' } : {};
    return await Event.find(query).sort({ date: -1 });
  }
  async findById(id) { return await Event.findById(id); }
  async findBySlug(slug) { return await Event.findOne({ slug }); }
  async create(data) { const ev = new Event(data); return await ev.save(); }
  async update(id, data) { return await Event.findByIdAndUpdate(id, data, { new: true }); }
  async delete(id) { await Event.findByIdAndDelete(id); return true; }
}
module.exports = new EventRepository();
`);

write(reposDir, 'registrationRepository.js', `
const EventRegistration = require('../models/EventRegistration');

class RegistrationRepository {
  async getRegistrationsByEventId(eventId) {
    const regs = await EventRegistration.find({ eventId }).populate('userId', 'name email enrollmentNumber');
    return regs.map(r => ({
      userId: r.userId.id,
      name: r.userId.name,
      email: r.userId.email,
      enrollmentNumber: r.userId.enrollmentNumber,
      status: r.status,
      registeredAt: r.registeredAt
    }));
  }
  async hasRegistered(eventId, userId) { return !!(await EventRegistration.findOne({ eventId, userId })); }
  async register(eventId, userId) { const reg = new EventRegistration({ eventId, userId }); await reg.save(); }
  async updateStatus(eventId, userId, status) { await EventRegistration.findOneAndUpdate({ eventId, userId }, { status }); }
}
module.exports = new RegistrationRepository();
`);

write(reposDir, 'announcementRepository.js', `
const Announcement = require('../models/Announcement');

class AnnouncementRepository {
  async findAllPublic() {
    return await Announcement.find({ 
      status: 'published', 
      $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }] 
    }).sort({ priority: -1, publishedAt: -1 });
  }
  async findAll() { return await Announcement.find().sort({ createdAt: -1 }); }
  async findById(id) { return await Announcement.findById(id); }
  async findBySlug(slug) { return await Announcement.findOne({ slug }); }
  async create(data) { const item = new Announcement(data); return await item.save(); }
  async update(id, data) { return await Announcement.findByIdAndUpdate(id, data, { new: true }); }
  async delete(id) { await Announcement.findByIdAndDelete(id); return true; }
}
module.exports = new AnnouncementRepository();
`);

write(reposDir, 'projectRepository.js', `
const Project = require('../models/Project');

class ProjectRepository {
  async findAll() {
    const projects = await Project.find().populate('domainId').populate('leadId').sort({ createdAt: -1 });
    return projects.map(p => this._mapWithRelations(p));
  }
  async findById(id) {
    const p = await Project.findById(id).populate('domainId').populate('leadId');
    return p ? this._mapWithRelations(p) : null;
  }
  async findBySlug(slug) {
    const p = await Project.findOne({ slug }).populate('domainId').populate('leadId');
    return p ? this._mapWithRelations(p) : null;
  }
  async create(data) { const p = new Project(data); await p.save(); return this.findById(p._id); }
  async update(id, data) { await Project.findByIdAndUpdate(id, data); return this.findById(id); }
  async delete(id) { await Project.findByIdAndDelete(id); return true; }
  
  _mapWithRelations(p) {
    const obj = p.toSafeObject();
    obj.domain_name = p.domainId ? p.domainId.name : null;
    obj.lead_name = p.leadId ? p.leadId.name : null;
    return obj;
  }
}
module.exports = new ProjectRepository();
`);

write(reposDir, 'teamRepository.js', `
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
`);

write(reposDir, 'achievementRepository.js', `
const Achievement = require('../models/Achievement');

const achievementRepository = {
  findAll: async () => { return await Achievement.find().sort({ date: -1, createdAt: -1 }); },
  findById: async (id) => { return await Achievement.findById(id); },
  create: async (data) => { const a = new Achievement(data); await a.save(); return a.id; },
  delete: async (id) => { await Achievement.findByIdAndDelete(id); }
};
module.exports = achievementRepository;
`);

console.log('Successfully wrote 11 models and 9 repositories.');
