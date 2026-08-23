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