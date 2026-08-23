const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  type: { type: String, required: true },
  date: Date,
  startTime: String,
  endTime: String,
  venue: String,
  onlineLink: String,
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  registrationDeadline: Date,
  maxParticipants: Number,
  registrationRequired: { type: Boolean, default: false },
  status: { type: String, default: 'draft' },
  bannerImage: String
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
eventSchema.methods.toSafeObject = function() {
  const obj = this.toObject({ virtuals: true });
  delete obj._id; delete obj.__v;
  return obj;
};
module.exports = mongoose.model('Event', eventSchema);