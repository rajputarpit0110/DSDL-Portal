class TeamRequest {
  constructor(row) {
    this.teamId = row.team_id;
    this.userId = row.user_id;
    this.status = row.status;
    this.message = row.message;
    this.requestedAt = row.requested_at;

    if (row.user_name) this.userName = row.user_name;
  }
}

module.exports = TeamRequest;
