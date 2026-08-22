const teamRepository = require('../repositories/teamRepository');
const ApiError = require('../utils/apiError');

class TeamService {
  async getAllTeams() {
    return await teamRepository.findAll();
  }

  async getTeamById(id) {
    const team = await teamRepository.findById(id);
    if (!team) {
      throw new ApiError(404, 'Team not found');
    }
    // Also attach members
    team.members = await teamRepository.getMembers(id);
    return team;
  }

  generateSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  async createTeam(data, creatorId) {
    let slug = data.slug || this.generateSlug(data.name);
    
    const existing = await teamRepository.findBySlug(slug);
    if (existing) {
        slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    const teamData = {
      ...data,
      slug,
      leaderId: creatorId, // Creator defaults to leader
      status: 'active'
    };

    const newTeam = await teamRepository.create(teamData);
    
    // Auto-add leader to memberships
    await teamRepository.addMember(newTeam.id, creatorId, 'LEADER');
    
    return newTeam;
  }

  async updateTeam(id, data, requestingUserId, requestingUserRole) {
    const team = await teamRepository.findById(id);
    if (!team) {
      throw new ApiError(404, 'Team not found');
    }

    const isLeader = team.leaderId === requestingUserId;
    const isAdmin = requestingUserRole === 'admin';

    if (!isLeader && !isAdmin) {
      throw new ApiError(403, 'You do not have permission to edit this team');
    }

    let slug = data.slug || team.slug;
    if (data.name && data.name !== team.name && !data.slug) {
       slug = this.generateSlug(data.name);
    }

    if (slug !== team.slug) {
      const existing = await teamRepository.findBySlug(slug);
      if (existing) {
          slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
      }
    }

    return await teamRepository.update(id, { ...team, ...data, slug });
  }

  async deleteTeam(id) {
    const team = await teamRepository.findById(id);
    if (!team) {
      throw new ApiError(404, 'Team not found');
    }
    await teamRepository.delete(id);
  }

  // Requests
  async requestToJoin(teamId, userId, message) {
    const team = await teamRepository.findById(teamId);
    if (!team) {
      throw new ApiError(404, 'Team not found');
    }

    if (team.status !== 'active') {
      throw new ApiError(400, 'Team is not accepting new members');
    }

    // Check if already a member
    const members = await teamRepository.getMembers(teamId);
    if (members.find(m => m.user_id === userId)) {
      throw new ApiError(400, 'You are already a member of this team');
    }

    // Check if request already exists
    const existingReq = await teamRepository.getRequest(teamId, userId);
    if (existingReq) {
      throw new ApiError(400, `You already have a ${existingReq.status} request for this team`);
    }

    await teamRepository.createRequest(teamId, userId, message);
    return { success: true, message: 'Request sent successfully' };
  }

  async respondToRequest(teamId, targetUserId, status, requestingUserId, requestingUserRole) {
    const team = await teamRepository.findById(teamId);
    if (!team) {
      throw new ApiError(404, 'Team not found');
    }

    const isLeader = team.leaderId === requestingUserId;
    const isAdmin = requestingUserRole === 'admin';

    if (!isLeader && !isAdmin) {
      throw new ApiError(403, 'You do not have permission to manage requests for this team');
    }

    const req = await teamRepository.getRequest(teamId, targetUserId);
    if (!req) {
      throw new ApiError(404, 'Request not found');
    }

    if (status === 'ACCEPTED') {
      const currentMembers = await teamRepository.countMembers(teamId);
      if (currentMembers >= team.maxMembers) {
        throw new ApiError(400, 'Team has reached its maximum capacity');
      }
      
      await teamRepository.addMember(teamId, targetUserId, 'MEMBER');
    }

    await teamRepository.updateRequestStatus(teamId, targetUserId, status);
    return { success: true, status };
  }

  async getTeamRequests(teamId, requestingUserId, requestingUserRole) {
    const team = await teamRepository.findById(teamId);
    if (!team) {
      throw new ApiError(404, 'Team not found');
    }

    const isLeader = team.leaderId === requestingUserId;
    const isAdmin = requestingUserRole === 'admin';

    if (!isLeader && !isAdmin) {
      throw new ApiError(403, 'You do not have permission to view requests for this team');
    }

    return await teamRepository.getRequests(teamId);
  }
}

module.exports = new TeamService();
