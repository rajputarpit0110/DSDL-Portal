const mongoose = require('mongoose');
const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  domainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain' },
  leaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'active' },
  maxMembers: { type: Number, default: 10 }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
teamSchema.methods.toSafeObject = function() {
  const obj = this.toObject({ virtuals: true });
  delete obj._id; delete obj.__v;
  return obj;
};
module.exports = mongoose.model('Team', teamSchema);