const ApiError = require('../utils/apiError');

exports.validateProjectInput = (data) => {
  const { title } = data;
  if (!title || title.trim().length === 0) {
    throw new ApiError(400, 'Project title is required');
  }
  if (data.status && !['PROPOSED', 'IN_PROGRESS', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'ARCHIVED'].includes(data.status)) {
    throw new ApiError(400, 'Invalid project status');
  }
};
