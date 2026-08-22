const ApiError = require('../utils/apiError');

exports.validateTeamInput = (data) => {
  const { name, domainId } = data;
  if (!name || name.trim().length === 0) {
    throw new ApiError(400, 'Team name is required');
  }
  if (!domainId) {
    throw new ApiError(400, 'Team domain ID is required');
  }
};
