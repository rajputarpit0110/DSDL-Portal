const achievementService = require('../services/achievementService');
const ApiResponse = require('../utils/ApiResponse');

const achievementController = {
  getAllAchievements: async (req, res, next) => {
    try {
      const achievements = await achievementService.getAllAchievements();
      res.json(new ApiResponse(200, 'Achievements retrieved successfully', achievements));
    } catch (error) {
      next(error);
    }
  },

  createAchievement: async (req, res, next) => {
    try {
      // In a real app, you might want to restrict this to domain leads/admins
      const achievement = await achievementService.createAchievement(req.body);
      res.status(201).json(new ApiResponse(201, 'Achievement created successfully', achievement));
    } catch (error) {
      next(error);
    }
  },

  deleteAchievement: async (req, res, next) => {
    try {
      await achievementService.deleteAchievement(req.params.id);
      res.json(new ApiResponse(200, 'Achievement deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
};

module.exports = achievementController;
