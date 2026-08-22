class Event {
  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.slug = row.slug;
    this.description = row.description;
    this.type = row.type;
    this.date = row.date;
    this.startTime = row.start_time;
    this.endTime = row.end_time;
    this.venue = row.venue;
    this.onlineLink = row.online_link;
    this.organizerId = row.organizer_id;
    this.registrationDeadline = row.registration_deadline;
    this.maxParticipants = row.max_participants;
    this.registrationRequired = Boolean(row.registration_required);
    this.status = row.status;
    this.bannerImage = row.banner_image;
    this.createdAt = row.created_at;
    this.updatedAt = row.updated_at;
  }
}

module.exports = Event;
