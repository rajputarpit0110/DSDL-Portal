const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  domainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain' },
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  teamMembers: [String],
  status: { type: String, default: 'PROPOSED' },
  githubUrl: String,
  liveUrl: String,
  tags: [String],
  bannerImage: String
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
projectSchema.methods.toSafeObject = function() {
  const obj = this.toObject({ virtuals: true });
  delete obj._id; delete obj.__v;
  return obj;
};
module.exports = mongoose.model('Project', projectSchema);