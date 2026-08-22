class Team {
  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.slug = row.slug;
    this.description = row.description;
    this.domainId = row.domain_id;
    this.leaderId = row.leader_id;
    this.status = row.status;
    this.maxMembers = row.max_members;
    this.createdAt = row.created_at;
    this.updatedAt = row.updated_at;

    // Optional Joined Fields
    if (row.domain_name) this.domainName = row.domain_name;
    if (row.leader_name) this.leaderName = row.leader_name;
  }
}

module.exports = Team;
