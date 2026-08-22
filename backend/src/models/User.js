class User {
  constructor({ id, name, email, password_hash, enrollment_number, branch, year, role, is_active, created_at, updated_at }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.passwordHash = password_hash;
    this.enrollmentNumber = enrollment_number;
    this.branch = branch;
    this.year = year;
    this.role = role;
    this.isActive = Boolean(is_active);
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }

  // Helper method to safely return user without password hash
  toSafeObject() {
    const { passwordHash, ...safeUser } = this;
    return safeUser;
  }
}

module.exports = User;
