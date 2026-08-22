const ApiError = require('../utils/apiError');

exports.validateDomainInput = (data) => {
  const { name } = data;
  if (!name || name.trim().length === 0) {
    throw new ApiError(400, 'Domain name is required');
  }
};
