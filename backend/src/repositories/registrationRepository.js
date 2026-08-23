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