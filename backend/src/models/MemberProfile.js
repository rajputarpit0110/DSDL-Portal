class MemberProfile {
  constructor({ user_id, profile_photo, phone, branch, year, domain_id, skills, bio, github, linkedin, joining_date, visibility }) {
    this.userId = user_id;
    this.profilePhoto = profile_photo;
    this.phone = phone;
    this.branch = branch;
    this.year = year;
    this.domainId = domain_id;
    this.skills = skills ? JSON.parse(skills) : [];
    this.bio = bio;
    this.github = github;
    this.linkedin = linkedin;
    this.joiningDate = joining_date;
    this.visibility = visibility;
  }
}

module.exports = MemberProfile;
