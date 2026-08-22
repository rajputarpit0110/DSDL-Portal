const domainService = require('../services/domainService');
const { validateDomainInput } = require('../validators/domainValidators');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllDomains = asyncHandler(async (req, res) => {
  const domains = await domainService.getAllDomains();
  res.status(200).json(new ApiResponse(200, 'Domains fetched successfully', domains));
});

exports.getDomainById = asyncHandler(async (req, res) => {
  const domain = await domainService.getDomainById(req.params.id);
  res.status(200).json(new ApiResponse(200, 'Domain fetched successfully', domain));
});

exports.createDomain = asyncHandler(async (req, res) => {
  validateDomainInput(req.body);
  const newDomain = await domainService.createDomain(req.body);
  res.status(201).json(new ApiResponse(201, 'Domain created successfully', newDomain));
});

exports.updateDomain = asyncHandler(async (req, res) => {
  if (req.body.name) {
    validateDomainInput(req.body);
  }
  const updatedDomain = await domainService.updateDomain(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, 'Domain updated successfully', updatedDomain));
});

exports.deleteDomain = asyncHandler(async (req, res) => {
  await domainService.deleteDomain(req.params.id);
  res.status(200).json(new ApiResponse(200, 'Domain deleted successfully'));
});
