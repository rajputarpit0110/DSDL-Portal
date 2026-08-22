const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const ApiError = require('../utils/apiError');

class AuthService {
  async registerUser({ name, email, password, enrollmentNumber, branch, year }) {
    if (!name || !email || !password) {
      throw new ApiError(400, 'Name, email, and password are required');
    }

    if (password.length < 8) {
      throw new ApiError(400, 'Password must be at least 8 characters');
    }

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ApiError(409, 'User already exists with this email');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await userRepository.create({
      name,
      email,
      passwordHash,
      enrollmentNumber,
      branch,
      year,
      role: 'member' // Hardcode member role for all registrations
    });

    return newUser.toSafeObject();
  }

  async loginUser(email, password) {
    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required');
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    return user.toSafeObject();
  }

  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user.toSafeObject();
  }
}

module.exports = new AuthService();
