const AuditLog = require('../models/AuditLog');

class AuditLogRepository {
  async findAll(limit = 50) {
    return await AuditLog.find().sort({ createdAt: -1 }).limit(limit).populate('actor', 'name email role');
  }
  
  async create(data) {
    const log = new AuditLog(data);
    return await log.save();
  }
}

module.exports = new AuditLogRepository();
