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