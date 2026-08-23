const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  enrollmentNumber: String,
  branch: String,
  year: Number,
  role: { type: String, default: 'member' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
userSchema.methods.toSafeObject = function() {
  const obj = this.toObject({ virtuals: true });
  delete obj.passwordHash; delete obj._id; delete obj.__v;
  return obj;
};
module.exports = mongoose.model('User', userSchema);