class Project {
  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.slug = row.slug;
    this.description = row.description;
    this.domainId = row.domain_id;
    this.leadId = row.lead_id;
    
    try {
      this.teamMembers = row.team_members ? JSON.parse(row.team_members) : [];
    } catch (e) {
      this.teamMembers = [];
    }

    this.status = row.status;
    this.githubUrl = row.github_url;
    this.liveUrl = row.live_url;

    try {
      this.tags = row.tags ? JSON.parse(row.tags) : [];
    } catch (e) {
      this.tags = [];
    }

    this.bannerImage = row.banner_image;
    this.createdAt = row.created_at;
    this.updatedAt = row.updated_at;

    // Optional Joined Fields
    if (row.domain_name) this.domainName = row.domain_name;
    if (row.lead_name) this.leadName = row.lead_name;
  }
}

module.exports = Project;
