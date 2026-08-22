const announcementService = require('../services/announcementService');
const { validateAnnouncementInput } = require('../validators/announcementValidators');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.getAnnouncements = asyncHandler(async (req, res) => {
  const isAdminOrLead = req.user && (req.user.role === 'admin' || req.user.role === 'lead');
  const publishedOnly = isAdminOrLead && req.query.all === 'true' ? false : true;
  
  let announcements;
  if (publishedOnly) {
    announcements = await announcementService.getPublicAnnouncements();
  } else {
    announcements = await announcementService.getAllAnnouncements();
  }

  res.status(200).json(new ApiResponse(200, 'Announcements fetched successfully', announcements));
});

exports.getAnnouncementById = asyncHandler(async (req, res) => {
  const item = await announcementService.getAnnouncementById(req.params.id);
  res.status(200).json(new ApiResponse(200, 'Announcement fetched successfully', item));
});

exports.createAnnouncement = asyncHandler(async (req, res) => {
  validateAnnouncementInput(req.body);
  const newItem = await announcementService.createAnnouncement(req.body, req.user.userId);
  res.status(201).json(new ApiResponse(201, 'Announcement created successfully', newItem));
});

exports.updateAnnouncement = asyncHandler(async (req, res) => {
  if (req.body.title || req.body.content || req.body.type || req.body.priority) {
    validateAnnouncementInput(req.body);
  }
  const updatedItem = await announcementService.updateAnnouncement(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, 'Announcement updated successfully', updatedItem));
});

exports.deleteAnnouncement = asyncHandler(async (req, res) => {
  await announcementService.deleteAnnouncement(req.params.id);
  res.status(200).json(new ApiResponse(200, 'Announcement deleted successfully'));
});

exports.publishAnnouncement = asyncHandler(async (req, res) => {
  const { publish } = req.body;
  const updatedItem = await announcementService.publishAnnouncement(req.params.id, publish);
  res.status(200).json(new ApiResponse(200, `Announcement ${publish ? 'published' : 'unpublished'} successfully`, updatedItem));
});
