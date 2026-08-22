class Achievement {
  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.description = row.description;
    this.date = row.date;
    this.category = row.category;
    this.createdAt = row.created_at;
    this.updatedAt = row.updated_at;
  }
}

module.exports = Achievement;
