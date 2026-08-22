const ApiError = require('../utils/apiError');

exports.validateProjectInput = (data) => {
  const { title, domainId } = data;
  if (!title || title.trim().length === 0) {
    throw new ApiError(400, 'Project title is required');
  }
  if (!domainId) {
    throw new ApiError(400, 'Project domain ID is required');
  }
  if (data.status && !['PROPOSED', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED'].includes(data.status)) {
    throw new ApiError(400, 'Invalid project status');
  }
};
