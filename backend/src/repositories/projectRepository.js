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