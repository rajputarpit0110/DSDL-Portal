const User = require('../models/User');
const MemberProfile = require('../models/MemberProfile');
const TeamMembership = require('../models/TeamMembership');
const EventRegistration = require('../models/EventRegistration');
const Notification = require('../models/Notification');
const userRepository = require('../repositories/userRepository');
const eventRepository = require('../repositories/eventRepository');
const projectRepository = require('../repositories/projectRepository');
const domainRepository = require('../repositories/domainRepository');
const announcementRepository = require('../repositories/announcementRepository');
const teamRepository = require('../repositories/teamRepository');
const notificationRepository = require('../repositories/notificationRepository');
const auditLogRepository = require('../repositories/auditLogRepository');
const ApiError = require('../utils/apiError');
const bcrypt = require('bcryptjs');

class AdminService {
  async getDashboardStats(adminId) {
    const users = await User.find().sort({ createdAt: -1 });
    const events = await eventRepository.findAll();
    const projects = await projectRepository.findAll();
    const domains = await domainRepository.findAll();
    const announcements = await announcementRepository.findAll();
    const teams = await teamRepository.findAll();
    const unreadNotifications = adminId ? await notificationRepository.countUnread(adminId) : 0;

    const members = users.filter(u => u.role === 'member');
    const leads = users.filter(u => u.role === 'lead');
    const admins = users.filter(u => u.role === 'admin');
    const activeUsers = users.filter(u => u.isActive !== false);
    const suspendedUsers = users.filter(u => u.isActive === false);

    const activeProjects = projects.filter(p => p.status === 'ACTIVE' || p.status === 'IN_PROGRESS');
    const upcomingEvents = events.filter(e => e.status === 'published' || e.status === 'UPCOMING');

    // Calculate domain distribution
    const profiles = await MemberProfile.find().populate('domainId', 'name slug');
    const domainCounts = {};
    domains.forEach(d => {
      domainCounts[d.name] = 0;
    });
    profiles.forEach(p => {
      if (p.domainId && p.domainId.name) {
        domainCounts[p.domainId.name] = (domainCounts[p.domainId.name] || 0) + 1;
      }
    });

    return {
      totalUsers: users.length,
      totalMembers: members.length,
      totalLeads: leads.length,
      totalAdmins: admins.length,
      activeUsers: activeUsers.length,
      suspendedUsers: suspendedUsers.length,
      totalDomains: domains.length,
      totalEvents: events.length,
      upcomingEvents: upcomingEvents.length,
      totalProjects: projects.length,
      activeProjects: activeProjects.length,
      totalAnnouncements: announcements.length,
      totalTeams: teams.length,
      unreadNotifications,
      domainDistribution: Object.keys(domainCounts).map(name => ({ name, count: domainCounts[name] })),
      recentUsers: users.slice(0, 5).map(u => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        role: u.role,
        isActive: u.isActive,
        createdAt: u.createdAt
      }))
    };
  }

  async getAuditLogs() {
    const logs = await auditLogRepository.findAll();
    return logs.map(l => l.toSafeObject());
  }

  async logAction(actorId, action, entity, entityId, metadata = {}) {
    await auditLogRepository.create({
      actor: actorId,
      action,
      entity,
      entityId,
      metadata
    });
  }

  async exportReport() {
    const users = await userRepository.findAll();
    const events = await eventRepository.findAll();
    
    // Very simple CSV generation
    let csv = 'Type,Name,Email,Status,Role\n';
    users.forEach(u => {
      csv += `User,"${u.name}","${u.email}",${u.isActive ? 'Active' : 'Inactive'},${u.role}\n`;
    });
    events.forEach(e => {
      csv += `Event,"${e.title}",${e.status}\n`;
    });
    
    return csv;
  }

  async getAllUsers() {
    const users = await User.find().sort({ createdAt: -1 });
    const userIds = users.map(u => u._id);
    const MemberProfile = require('../models/MemberProfile');
    const profiles = await MemberProfile.find({ userId: { $in: userIds } }).populate('domainId', 'name slug icon');
    
    const profileMap = {};
    profiles.forEach(p => {
      if (p.userId) {
        profileMap[p.userId.toString()] = p;
      }
    });

    return users.map(u => {
      const p = profileMap[u._id.toString()];
      return {
        id: u._id.toString(),
        _id: u._id.toString(),
        name: u.name,
        email: u.email,
        role: u.role || 'member',
        isActive: u.isActive !== undefined ? u.isActive : true,
        enrollmentNumber: u.enrollmentNumber || '',
        branch: u.branch || (p ? p.branch : '') || '',
        year: u.year || (p ? p.year : null) || null,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        domainId: p && p.domainId ? (p.domainId._id ? p.domainId._id.toString() : p.domainId.toString()) : null,
        domainName: p && p.domainId ? p.domainId.name : null,
        domain_name: p && p.domainId ? p.domainId.name : 'General',
        phone: p ? p.phone || '' : '',
        bio: p ? p.bio || '' : '',
        skills: p ? p.skills || [] : [],
        github: p ? p.github || '' : '',
        linkedin: p ? p.linkedin || '' : '',
        profilePhoto: p ? p.profilePhoto || '' : '',
        visibility: p ? p.visibility || 'public' : 'public'
      };
    });
  }

  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const ApiError = require('../utils/apiError');
      throw new ApiError(404, 'User not found');
    }
    const MemberProfile = require('../models/MemberProfile');
    const profile = await MemberProfile.findOne({ userId: user._id }).populate('domainId', 'name slug icon');
    
    return {
      id: user._id.toString(),
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || 'member',
      isActive: user.isActive !== undefined ? user.isActive : true,
      enrollmentNumber: user.enrollmentNumber || '',
      branch: user.branch || (profile ? profile.branch : '') || '',
      year: user.year || (profile ? profile.year : null) || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      domainId: profile && profile.domainId ? (profile.domainId._id ? profile.domainId._id.toString() : profile.domainId.toString()) : null,
      domainName: profile && profile.domainId ? profile.domainId.name : null,
      domain_name: profile && profile.domainId ? profile.domainId.name : 'General',
      phone: profile ? profile.phone || '' : '',
      bio: profile ? profile.bio || '' : '',
      skills: profile ? profile.skills || [] : [],
      github: profile ? profile.github || '' : '',
      linkedin: profile ? profile.linkedin || '' : '',
      profilePhoto: profile ? profile.profilePhoto || '' : '',
      visibility: profile ? profile.visibility || 'public' : 'public'
    };
  }

  async createUser(adminId, userData) {
    const ApiError = require('../utils/apiError');
    const bcrypt = require('bcryptjs');
    const { 
      name, 
      email, 
      password, 
      role, 
      domainId, 
      phone, 
      branch, 
      year, 
      enrollmentNumber, 
      skills, 
      bio, 
      github, 
      linkedin, 
      visibility, 
      isActive 
    } = userData;

    if (!name || !email || !password) {
      throw new ApiError(400, 'Name, email, and password are required');
    }
    if (password.length < 6) {
      throw new ApiError(400, 'Password must be at least 6 characters');
    }

    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      throw new ApiError(409, 'User with this email already exists');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: role || 'member',
      enrollmentNumber: enrollmentNumber || '',
      branch: branch || '',
      year: year ? parseInt(year, 10) : undefined,
      isActive: isActive !== undefined ? Boolean(isActive) : true
    });
    await newUser.save();

    const parsedSkills = Array.isArray(skills) 
      ? skills 
      : (typeof skills === 'string' && skills.trim() ? skills.split(',').map(s => s.trim()).filter(Boolean) : []);

    const MemberProfile = require('../models/MemberProfile');
    await MemberProfile.findOneAndUpdate(
      { userId: newUser._id },
      {
        userId: newUser._id,
        phone: phone || '',
        branch: branch || '',
        year: year ? parseInt(year, 10) : undefined,
        domainId: domainId || null,
        skills: parsedSkills,
        bio: bio || '',
        github: github || '',
        linkedin: linkedin || '',
        visibility: visibility || 'public'
      },
      { upsert: true, new: true }
    );

    await this.logAction(adminId, 'USER_CREATE', 'User', newUser._id, { email: newUser.email, role: newUser.role });

    return await this.getUserById(newUser._id);
  }

  async updateUser(adminId, userId, updateData) {
    const ApiError = require('../utils/apiError');
    const bcrypt = require('bcryptjs');
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const { 
      name, 
      email, 
      password, 
      role, 
      domainId, 
      phone, 
      branch, 
      year, 
      enrollmentNumber, 
      skills, 
      bio, 
      github, 
      linkedin, 
      visibility, 
      isActive,
      profilePhoto
    } = updateData;

    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      const emailExists = await User.findOne({ email: email.trim().toLowerCase(), _id: { $ne: userId } });
      if (emailExists) {
        throw new ApiError(409, 'Another user already uses this email');
      }
      user.email = email.trim().toLowerCase();
    }

    if (name) user.name = name.trim();
    if (role) user.role = role;
    if (enrollmentNumber !== undefined) user.enrollmentNumber = enrollmentNumber;
    if (branch !== undefined) user.branch = branch;
    if (year !== undefined) user.year = year ? parseInt(year, 10) : null;
    if (isActive !== undefined) user.isActive = Boolean(isActive);

    if (password && password.trim().length >= 6) {
      const salt = await bcrypt.genSalt(12);
      user.passwordHash = await bcrypt.hash(password.trim(), salt);
    }

    await user.save();

    const parsedSkills = Array.isArray(skills) 
      ? skills 
      : (typeof skills === 'string' ? skills.split(',').map(s => s.trim()).filter(Boolean) : undefined);

    const MemberProfile = require('../models/MemberProfile');
    const profileUpdate = {};
    if (phone !== undefined) profileUpdate.phone = phone;
    if (branch !== undefined) profileUpdate.branch = branch;
    if (year !== undefined) profileUpdate.year = year ? parseInt(year, 10) : null;
    if (domainId !== undefined) profileUpdate.domainId = domainId || null;
    if (parsedSkills !== undefined) profileUpdate.skills = parsedSkills;
    if (bio !== undefined) profileUpdate.bio = bio;
    if (github !== undefined) profileUpdate.github = github;
    if (linkedin !== undefined) profileUpdate.linkedin = linkedin;
    if (visibility !== undefined) profileUpdate.visibility = visibility;
    if (profilePhoto !== undefined) profileUpdate.profilePhoto = profilePhoto;

    await MemberProfile.findOneAndUpdate(
      { userId: user._id },
      { $set: profileUpdate },
      { upsert: true, new: true }
    );

    await this.logAction(adminId, 'USER_UPDATE', 'User', user._id, { email: user.email, role: user.role });

    return await this.getUserById(user._id);
  }

  async updateUserRole(adminId, userId, newRole) {
    const ApiError = require('../utils/apiError');
    if (!['admin', 'lead', 'member'].includes(newRole)) {
      throw new ApiError(400, 'Invalid role. Must be admin, lead, or member');
    }
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');

    user.role = newRole;
    await user.save();

    await this.logAction(adminId, 'USER_ROLE_CHANGE', 'User', user._id, { newRole });
    return await this.getUserById(user._id);
  }

  async updateUserStatus(adminId, userId, isActive) {
    const ApiError = require('../utils/apiError');
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');

    if (userId.toString() === adminId.toString() && !isActive) {
      throw new ApiError(400, 'You cannot deactivate your own admin account');
    }

    user.isActive = Boolean(isActive);
    await user.save();

    await this.logAction(adminId, 'USER_STATUS_CHANGE', 'User', user._id, { isActive: user.isActive });
    return await this.getUserById(user._id);
  }

  async resetUserPassword(adminId, userId, newPassword) {
    const ApiError = require('../utils/apiError');
    const bcrypt = require('bcryptjs');
    if (!newPassword || newPassword.length < 6) {
      throw new ApiError(400, 'New password must be at least 6 characters');
    }

    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');

    const salt = await bcrypt.genSalt(12);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    await this.logAction(adminId, 'USER_PASSWORD_RESET', 'User', user._id, {});
    return { success: true, message: `Password reset successfully for ${user.name}` };
  }

  async deleteUser(adminId, userId) {
    const ApiError = require('../utils/apiError');
    if (userId.toString() === adminId.toString()) {
      throw new ApiError(400, 'You cannot delete your own admin account');
    }

    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');

    // Delete related records
    const MemberProfile = require('../models/MemberProfile');
    const TeamMembership = require('../models/TeamMembership');
    const EventRegistration = require('../models/EventRegistration');
    const Notification = require('../models/Notification');

    await MemberProfile.deleteMany({ userId });
    await TeamMembership.deleteMany({ userId });
    await EventRegistration.deleteMany({ userId });
    await Notification.deleteMany({ recipient: userId });
    await User.findByIdAndDelete(userId);

    await this.logAction(adminId, 'USER_DELETE', 'User', userId, { email: user.email, name: user.name });
    return { success: true, message: `User ${user.name} was permanently deleted.` };
  }
}

module.exports = new AdminService();
