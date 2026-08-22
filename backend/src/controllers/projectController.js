const projectService = require('../services/projectService');
const { validateProjectInput } = require('../validators/projectValidators');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.getAllProjects();
  res.status(200).json(new ApiResponse(200, 'Projects fetched successfully', projects));
});

exports.getProjectById = asyncHandler(async (req, res) => {
  const project = await projectService.getProjectById(req.params.id);
  res.status(200).json(new ApiResponse(200, 'Project fetched successfully', project));
});

exports.createProject = asyncHandler(async (req, res) => {
  validateProjectInput(req.body);
  const newProject = await projectService.createProject(req.body, req.user.userId);
  res.status(201).json(new ApiResponse(201, 'Project submitted successfully', newProject));
});

exports.updateProject = asyncHandler(async (req, res) => {
  if (req.body.title || req.body.domainId) {
    validateProjectInput(req.body);
  }
  const updatedProject = await projectService.updateProject(
    req.params.id, 
    req.body, 
    req.user.userId, 
    req.user.role
  );
  res.status(200).json(new ApiResponse(200, 'Project updated successfully', updatedProject));
});

exports.deleteProject = asyncHandler(async (req, res) => {
  await projectService.deleteProject(req.params.id);
  res.status(200).json(new ApiResponse(200, 'Project deleted successfully'));
});
