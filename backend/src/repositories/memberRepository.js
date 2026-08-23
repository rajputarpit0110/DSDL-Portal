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
  async findAllPublic(limit = 10, offset = 0) {
    const profiles = await MemberProfile.find({ visibility: { $in: ['public', null] } })
      .populate({ path: 'userId', select: 'id name isActive createdAt', match: { isActive: true } })
      .populate('domainId', 'name')
      .skip(offset).limit(limit)
      .sort({ createdAt: -1 });

    return profiles.filter(p => p.userId).map(p => ({
      id: p.userId.id,
      name: p.userId.name,
      profilePhoto: p.profilePhoto,
      bio: p.bio,
      domain_name: p.domainId ? p.domainId.name : null
    }));
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