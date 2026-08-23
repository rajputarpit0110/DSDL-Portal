const mongoose = require('mongoose');
const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  summary: String,
  type: { type: String, default: 'NEWS' },
  priority: { type: String, default: 'NORMAL' },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'draft' },
  publishedAt: Date,
  expiresAt: Date
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
announcementSchema.methods.toSafeObject = function() {
  const obj = this.toObject({ virtuals: true });
  delete obj._id; delete obj.__v;
  return obj;
};
module.exports = mongoose.model('Announcement', announcementSchema);