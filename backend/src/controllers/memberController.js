const memberService = require('../services/memberService');
const { validateProfileInput } = require('../validators/memberValidators');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');

exports.getPublicMembers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  
  const members = await memberService.getPublicMembers(page, limit);
  // Optional: add total count logic in pagination
  res.status(200).json(new ApiResponse(200, 'Members fetched successfully', members, { page, limit }));
});

exports.getMemberProfile = asyncHandler(async (req, res) => {
  const member = await memberService.getMemberProfile(req.params.id);
  
  // If visibility is private, only the user or admin can see it
  if (member.profile.visibility === 'private') {
    if (!req.user || (req.user.userId !== parseInt(req.params.id, 10) && req.user.role !== 'admin')) {
      throw new ApiError(403, 'This profile is private');
    }
  }

  res.status(200).json(new ApiResponse(200, 'Profile fetched successfully', member));
});

exports.updateMemberProfile = asyncHandler(async (req, res) => {
  const targetUserId = parseInt(req.params.id, 10);
  
  // Only the user themselves or an admin can update the profile
  if (req.user.userId !== targetUserId && req.user.role !== 'admin') {
     throw new ApiError(403, 'Forbidden to edit another user profile');
  }

  validateProfileInput(req.body);
  const updatedProfile = await memberService.updateMemberProfile(targetUserId, req.body);
  
  res.status(200).json(new ApiResponse(200, 'Profile updated successfully', updatedProfile));
});
