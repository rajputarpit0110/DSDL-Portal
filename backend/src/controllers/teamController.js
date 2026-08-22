const teamService = require('../services/teamService');
const { validateTeamInput } = require('../validators/teamValidators');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllTeams = asyncHandler(async (req, res) => {
  const teams = await teamService.getAllTeams();
  res.status(200).json(new ApiResponse(200, 'Teams fetched successfully', teams));
});

exports.getTeamById = asyncHandler(async (req, res) => {
  const team = await teamService.getTeamById(req.params.id);
  res.status(200).json(new ApiResponse(200, 'Team fetched successfully', team));
});

exports.createTeam = asyncHandler(async (req, res) => {
  validateTeamInput(req.body);
  const newTeam = await teamService.createTeam(req.body, req.user.userId);
  res.status(201).json(new ApiResponse(201, 'Team created successfully', newTeam));
});

exports.updateTeam = asyncHandler(async (req, res) => {
  if (req.body.name || req.body.domainId) {
    validateTeamInput(req.body);
  }
  const updatedTeam = await teamService.updateTeam(
    req.params.id, 
    req.body, 
    req.user.userId, 
    req.user.role
  );
  res.status(200).json(new ApiResponse(200, 'Team updated successfully', updatedTeam));
});

exports.deleteTeam = asyncHandler(async (req, res) => {
  await teamService.deleteTeam(req.params.id);
  res.status(200).json(new ApiResponse(200, 'Team deleted successfully'));
});

// Requests

exports.requestToJoin = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const result = await teamService.requestToJoin(req.params.id, req.user.userId, message);
  res.status(201).json(new ApiResponse(201, result.message, result));
});

exports.respondToRequest = asyncHandler(async (req, res) => {
  const { status } = req.body; // ACCEPTED, REJECTED
  const result = await teamService.respondToRequest(
    req.params.id, 
    req.params.userId, 
    status, 
    req.user.userId, 
    req.user.role
  );
  res.status(200).json(new ApiResponse(200, `Request ${status}`, result));
});

exports.getTeamRequests = asyncHandler(async (req, res) => {
  const requests = await teamService.getTeamRequests(
    req.params.id, 
    req.user.userId, 
    req.user.role
  );
  res.status(200).json(new ApiResponse(200, 'Requests fetched successfully', requests));
});
