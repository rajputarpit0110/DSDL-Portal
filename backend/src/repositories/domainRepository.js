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