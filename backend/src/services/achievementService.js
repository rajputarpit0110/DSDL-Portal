const achievementRepository = require('../repositories/achievementRepository');

const achievementService = {
  getAllAchievements: async () => {
    return await achievementRepository.findAll();
  },

  createAchievement: async (achievementData) => {
    if (!achievementData.title) {
      const error = new Error('Achievement title is required');
      error.statusCode = 400;
      throw error;
    }

    const id = await achievementRepository.create(achievementData);
    return await achievementRepository.findById(id);
  },

  deleteAchievement: async (id) => {
    const achievement = await achievementRepository.findById(id);
    if (!achievement) {
      const error = new Error('Achievement not found');
      error.statusCode = 404;
      throw error;
    }

    await achievementRepository.delete(id);
  }
};

module.exports = achievementService;
