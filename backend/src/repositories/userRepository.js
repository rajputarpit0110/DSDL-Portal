const User = require('../models/User');

class UserRepository {
  async findByEmail(email) { return await User.findOne({ email: email.toLowerCase() }); }
  async findById(id) { return await User.findById(id); }
  async findAll() { return await User.find(); }
  async create(userData) {
    const { name, email, passwordHash, enrollmentNumber, branch, year, role, isActive } = userData;
    const user = new User({ 
      name, 
      email: email.toLowerCase(), 
      passwordHash, 
      enrollmentNumber, 
      branch, 
      year, 
      role: role || 'member',
      isActive: isActive !== undefined ? isActive : true
    });
    return await user.save();
  }
  async update(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }
  async delete(id) {
    return await User.findByIdAndDelete(id);
  }
}
module.exports = new UserRepository();