class EventRegistration {
  constructor(row) {
    this.eventId = row.event_id;
    this.userId = row.user_id;
    this.status = row.status;
    this.registeredAt = row.registered_at;
    
    // Optional joined data
    if (row.user_name) this.userName = row.user_name;
    if (row.user_email) this.userEmail = row.user_email;
  }
}

module.exports = EventRegistration;
