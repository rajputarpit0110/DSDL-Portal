const mongoose = require('mongoose');
const eventRegistrationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'REGISTERED' },
  registeredAt: { type: Date, default: Date.now }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
eventRegistrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });
eventRegistrationSchema.methods.toSafeObject = function() {
  const obj = this.toObject({ virtuals: true });
  delete obj._id; delete obj.__v;
  return obj;
};
module.exports = mongoose.model('EventRegistration', eventRegistrationSchema);