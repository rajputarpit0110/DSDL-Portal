const memberRepository = require('../repositories/memberRepository');
const userRepository = require('../repositories/userRepository');
const ApiError = require('../utils/apiError');

class MemberService {
  async getPublicMembers(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const members = await memberRepository.findAllPublic(limit, offset);
    return members;
  }

  async getMemberProfile(id) {
    const member = await memberRepository.getCombinedMemberData(id);
    if (!member) {
      throw new ApiError(404, 'Member not found');
    }
    
    // Only return if profile is public, or we need to bypass this logic in controller for self/admin
    return member;
  }

  async updateMemberProfile(userId, profileData) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    
    const updatedProfile = await memberRepository.upsertProfile(userId, profileData);
    return updatedProfile;
  }
}

module.exports = new MemberService();
