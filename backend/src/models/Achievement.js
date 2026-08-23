const mongoose = require('mongoose');
const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: String,
  category: String
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
achievementSchema.methods.toSafeObject = function() {
  const obj = this.toObject({ virtuals: true });
  delete obj._id; delete obj.__v;
  return obj;
};
module.exports = mongoose.model('Achievement', achievementSchema);