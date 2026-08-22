class Announcement {
  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.slug = row.slug;
    this.content = row.content;
    this.summary = row.summary;
    this.type = row.type;
    this.priority = row.priority;
    this.authorId = row.author_id;
    this.status = row.status;
    this.publishedAt = row.published_at;
    this.expiresAt = row.expires_at;
    this.createdAt = row.created_at;
    this.updatedAt = row.updated_at;
  }
}

module.exports = Announcement;
