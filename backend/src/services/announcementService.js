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

    const newAnnouncement = await announcementRepository.create({ ...data, slug, authorId });
    
    // Notify users if it's published immediately
    if (newAnnouncement.status === 'published') {
      try {
        const userRepository = require('../repositories/userRepository');
        const notificationRepository = require('../repositories/notificationRepository');
        const users = await userRepository.findAll();
        for (const user of users) {
          if (user.id !== authorId) {
            await notificationRepository.create({
              receiver: user.id,
              type: 'ANNOUNCEMENT',
              title: 'New Announcement: ' + newAnnouncement.title,
              message: 'Check out the new announcement on the portal.',
              relatedEntity: 'Announcement',
              relatedEntityId: newAnnouncement.id
            });
          }
        }
      } catch(err) {
        console.error('Failed to notify users', err);
      }
    }
    
    return newAnnouncement;
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
    const updated = await announcementRepository.update(id, { ...item, status: newStatus, publishedAt });
    
    if (publishStatus) {
      try {
        const userRepository = require('../repositories/userRepository');
        const notificationRepository = require('../repositories/notificationRepository');
        const users = await userRepository.findAll();
        for (const user of users) {
          if (user.id !== item.authorId) {
            await notificationRepository.create({
              receiver: user.id,
              type: 'ANNOUNCEMENT',
              title: 'New Announcement: ' + updated.title,
              message: 'Check out the new announcement on the portal.',
              relatedEntity: 'Announcement',
              relatedEntityId: updated.id
            });
          }
        }
      } catch(err) {
        console.error('Failed to notify users', err);
      }
    }
    
    return updated;
  }
}

module.exports = new AnnouncementService();
