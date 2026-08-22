class Domain {
  constructor({ id, name, slug, description, icon, image_url, lead_id, created_at, updated_at }) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.description = description;
    this.icon = icon;
    this.imageUrl = image_url;
    this.leadId = lead_id;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }
}

module.exports = Domain;
