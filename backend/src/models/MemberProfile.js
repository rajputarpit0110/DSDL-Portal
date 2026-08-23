const mongoose = require('mongoose');
const memberProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  profilePhoto: String,
  phone: String,
  branch: String,
  year: Number,
  domainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain' },
  skills: [String],
  bio: String,
  github: String,
  linkedin: String,
  joiningDate: { type: Date, default: Date.now },
  visibility: { type: String, default: 'public' }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
memberProfileSchema.methods.toSafeObject = function() {
  const obj = this.toObject({ virtuals: true });
  delete obj._id; delete obj.__v;
  return obj;
};
module.exports = mongoose.model('MemberProfile', memberProfileSchema);