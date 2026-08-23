const eventRepository = require('../repositories/eventRepository');
const registrationRepository = require('../repositories/registrationRepository');
const ApiError = require('../utils/apiError');

class EventService {
  async getAllEvents(publishedOnly = true) {
    return await eventRepository.findAll(publishedOnly);
  }

  async getEventById(id) {
    const event = await eventRepository.findById(id);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }
    return event;
  }

  generateSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  async createEvent(data, organizerId) {
    let slug = data.slug || this.generateSlug(data.title);
    
    const existing = await eventRepository.findBySlug(slug);
    if (existing) {
      throw new ApiError(409, 'Event with this slug/title already exists');
    }

    const newEvent = await eventRepository.create({ ...data, slug, organizerId });
    
    // Notify users
    try {
      const userRepository = require('../repositories/userRepository');
      const notificationRepository = require('../repositories/notificationRepository');
      const users = await userRepository.findAll();
      for (const user of users) {
        if (user.id !== organizerId) {
          await notificationRepository.create({
            receiver: user.id,
            type: 'EVENT',
            title: 'New Event: ' + newEvent.title,
            message: 'A new event has been scheduled. Check it out!',
            relatedEntity: 'Event',
            relatedEntityId: newEvent.id
          });
        }
      }
    } catch(err) {
      console.error('Failed to notify users of new event', err);
    }
    
    return newEvent;
  }

  async updateEvent(id, data) {
    const event = await eventRepository.findById(id);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    let slug = data.slug || event.slug;
    if (data.title && data.title !== event.title && !data.slug) {
       slug = this.generateSlug(data.title);
    }

    if (slug !== event.slug) {
      const existing = await eventRepository.findBySlug(slug);
      if (existing) {
        throw new ApiError(409, 'Event with this slug/title already exists');
      }
    }

    return await eventRepository.update(id, { ...event, ...data, slug });
  }

  async deleteEvent(id) {
    const event = await eventRepository.findById(id);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }
    await eventRepository.delete(id);
  }

  async publishEvent(id, publishStatus) {
    const event = await eventRepository.findById(id);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }
    const newStatus = publishStatus ? 'published' : 'draft';
    return await eventRepository.update(id, { ...event, status: newStatus });
  }

  // --- Registration Logic ---

  async registerUserForEvent(eventId, userId) {
    const event = await eventRepository.findById(eventId);
    
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    if (event.status !== 'published') {
      throw new ApiError(400, 'Event is not open for registration');
    }

    if (!event.registrationRequired) {
      throw new ApiError(400, 'This event does not require registration');
    }

    // Check deadlines
    if (event.registrationDeadline) {
      const deadline = new Date(event.registrationDeadline);
      const now = new Date();
      if (now > deadline) {
        throw new ApiError(400, 'Registration deadline has passed');
      }
    }

    // Check if already registered
    const existingRegistration = await registrationRepository.getRegistration(eventId, userId);
    if (existingRegistration) {
      throw new ApiError(409, `User is already ${existingRegistration.status} for this event`);
    }

    // Check capacity and waitlist
    let status = 'REGISTERED';
    if (event.maxParticipants > 0) {
      const currentCount = await registrationRepository.countEventRegistrations(eventId);
      if (currentCount >= event.maxParticipants) {
        status = 'WAITLISTED';
      }
    }

    return await registrationRepository.create(eventId, userId, status);
  }

  async getEventRegistrations(eventId) {
    // Verify event exists
    await this.getEventById(eventId);
    return await registrationRepository.getRegistrationsForEvent(eventId);
  }
}

module.exports = new EventService();
