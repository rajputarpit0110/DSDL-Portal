const userRepository = require('../repositories/userRepository');
const eventRepository = require('../repositories/eventRepository');
const projectRepository = require('../repositories/projectRepository');
const domainRepository = require('../repositories/domainRepository');
const announcementRepository = require('../repositories/announcementRepository');
const teamRepository = require('../repositories/teamRepository');
const notificationRepository = require('../repositories/notificationRepository');
const auditLogRepository = require('../repositories/auditLogRepository');

class AdminService {
  async getDashboardStats(adminId) {
    const users = await userRepository.findAll();
    const events = await eventRepository.findAll();
    const projects = await projectRepository.findAll();
    const domains = await domainRepository.findAll();
    const announcements = await announcementRepository.findAll();
    const teams = await teamRepository.findAll();
    const unreadNotifications = await notificationRepository.countUnread(adminId);

    const members = users.filter(u => u.role === 'member');
    const leads = users.filter(u => u.role === 'lead');

    return {
      totalMembers: members.length,
      totalLeads: leads.length,
      totalDomains: domains.length,
      totalEvents: events.length,
      totalAnnouncements: announcements.length,
      activeProjects: projects.filter(p => p.status === 'IN_PROGRESS').length,
      activeTeams: teams.length,
      unreadNotifications,
      systemAlerts: 0 // Mocked for now
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
    let csv = 'Type,Name,Status/Role\n';
    users.forEach(u => {
      csv += `User,${u.name},${u.role}\n`;
    });
    events.forEach(e => {
      csv += `Event,${e.title},${e.status}\n`;
    });
    
    return csv;
  }
}

module.exports = new AdminService();
