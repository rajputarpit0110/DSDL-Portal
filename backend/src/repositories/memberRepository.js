const MemberProfile = require('../models/MemberProfile');
const User = require('../models/User');

class MemberRepository {
  async findProfileByUserId(userId) {
    return await MemberProfile.findOne({ userId });
  }
  async getCombinedMemberData(userId) {
    const userDoc = await User.findById(userId);
    if (!userDoc) return null;
    const profileDoc = await MemberProfile.findOne({ userId }).populate('domainId', 'name');
    
    return { 
      user: userDoc.toSafeObject(), 
      profile: profileDoc ? profileDoc.toSafeObject() : null, 
      domainName: profileDoc && profileDoc.domainId ? profileDoc.domainId.name : null 
    };
  }
  async findAllPublic(limit = 100, offset = 0) {
    const users = await User.find({ isActive: true })
      .select('id name email role createdAt')
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 });

    const userIds = users.map(u => u._id);
    const profiles = await MemberProfile.find({ userId: { $in: userIds } }).populate('domainId', 'name');
    
    const profileMap = {};
    profiles.forEach(p => {
      if (p.userId) {
        profileMap[p.userId.toString()] = p;
      }
    });

    return users.map(u => {
      const p = profileMap[u._id.toString()];
      return {
        id: u.id || u._id,
        name: u.name,
        email: u.email,
        role: u.role || 'member',
        profilePhoto: p ? p.profilePhoto : null,
        bio: p ? p.bio : '',
        domain_name: p && p.domainId ? p.domainId.name : 'General'
      };
    });
  }
  async upsertProfile(userId, profileData) {
    const { profilePhoto, phone, branch, year, domainId, skills, bio, github, linkedin, visibility } = profileData;
    return await MemberProfile.findOneAndUpdate(
      { userId },
      { profilePhoto, phone, branch, year, domainId, skills, bio, github, linkedin, visibility },
      { new: true, upsert: true }
    );
  }
}
module.exports = new MemberRepository();