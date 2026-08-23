const User = require('../models/User');

class UserRepository {
  async findByEmail(email) { return await User.findOne({ email: email.toLowerCase() }); }
  async findById(id) { return await User.findById(id); }
  async findAll() { return await User.find(); }
  async create(userData) {
    const { name, email, passwordHash, enrollmentNumber, branch, year, role } = userData;
    const user = new User({ name, email: email.toLowerCase(), passwordHash, enrollmentNumber, branch, year, role: role || 'member' });
    return await user.save();
  }
}
module.exports = new UserRepository();