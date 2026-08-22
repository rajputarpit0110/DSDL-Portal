const announcementRepository = require('../repositories/announcementRepository');
const ApiError = require('../utils/apiError');

class AnnouncementService {
  async getPublicAnnouncements() {
    return await announcementRepository.findAllPublic();
  }

  async getAllAnnouncements() {
    return await announcementRepository.findAll();
  }

  async getAnnouncementById(id) {
    const item = await announcementRepository.findById(id);
    if (!item) {
      throw new ApiError(404, 'Announcement not found');
    }
    return item;
  }

  generateSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  async createAnnouncement(data, authorId) {
    let slug = data.slug || this.generateSlug(data.title);
    
    // Check slug uniqueness
    const existing = await announcementRepository.findBySlug(slug);
    if (existing) {
      // append random string to slug
        slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    return await announcementRepository.create({ ...data, slug, authorId });
  }

  async updateAnnouncement(id, data) {
    const item = await announcementRepository.findById(id);
    if (!item) {
      throw new ApiError(404, 'Announcement not found');
    }

    let slug = data.slug || item.slug;
    if (data.title && data.title !== item.title && !data.slug) {
       slug = this.generateSlug(data.title);
    }

    if (slug !== item.slug) {
      const existing = await announcementRepository.findBySlug(slug);
      if (existing) {
          slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
      }
    }

    return await announcementRepository.update(id, { ...item, ...data, slug });
  }

  async deleteAnnouncement(id) {
    const item = await announcementRepository.findById(id);
    if (!item) {
      throw new ApiError(404, 'Announcement not found');
    }
    await announcementRepository.delete(id);
  }

  async publishAnnouncement(id, publishStatus) {
    const item = await announcementRepository.findById(id);
    if (!item) {
      throw new ApiError(404, 'Announcement not found');
    }
    const newStatus = publishStatus ? 'published' : 'draft';
    const publishedAt = publishStatus ? new Date().toISOString() : null;
    return await announcementRepository.update(id, { ...item, status: newStatus, publishedAt });
  }
}

module.exports = new AnnouncementService();
