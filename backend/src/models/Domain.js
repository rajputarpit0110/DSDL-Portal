const mongoose = require('mongoose');
const domainSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  icon: String,
  imageUrl: String,
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
domainSchema.methods.toSafeObject = function() {
  const obj = this.toObject({ virtuals: true });
  delete obj._id; delete obj.__v;
  return obj;
};
module.exports = mongoose.model('Domain', domainSchema);