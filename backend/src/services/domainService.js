const domainRepository = require('../repositories/domainRepository');
const ApiError = require('../utils/apiError');

class DomainService {
  async getAllDomains() {
    return await domainRepository.findAll();
  }

  async getDomainById(id) {
    const domain = await domainRepository.findById(id);
    if (!domain) {
      throw new ApiError(404, 'Domain not found');
    }
    return domain;
  }

  generateSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  async createDomain(data) {
    let slug = data.slug || this.generateSlug(data.name);
    
    // Check slug uniqueness
    const existing = await domainRepository.findBySlug(slug);
    if (existing) {
      throw new ApiError(409, 'Domain with this slug/name already exists');
    }

    return await domainRepository.create({ ...data, slug });
  }

  async updateDomain(id, data) {
    const domain = await domainRepository.findById(id);
    if (!domain) {
      throw new ApiError(404, 'Domain not found');
    }

    let slug = data.slug || domain.slug;
    if (data.name && data.name !== domain.name && !data.slug) {
       slug = this.generateSlug(data.name);
    }

    if (slug !== domain.slug) {
      const existing = await domainRepository.findBySlug(slug);
      if (existing) {
        throw new ApiError(409, 'Domain with this slug/name already exists');
      }
    }

    return await domainRepository.update(id, { ...domain, ...data, slug });
  }

  async deleteDomain(id) {
    const domain = await domainRepository.findById(id);
    if (!domain) {
      throw new ApiError(404, 'Domain not found');
    }
    await domainRepository.delete(id);
  }
}

module.exports = new DomainService();
