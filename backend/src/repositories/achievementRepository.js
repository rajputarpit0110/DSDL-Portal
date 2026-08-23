const Achievement = require('../models/Achievement');

const achievementRepository = {
  findAll: async () => { return await Achievement.find().sort({ date: -1, createdAt: -1 }); },
  findById: async (id) => { return await Achievement.findById(id); },
  create: async (data) => { const a = new Achievement(data); await a.save(); return a.id; },
  delete: async (id) => { await Achievement.findByIdAndDelete(id); }
};
module.exports = achievementRepository;