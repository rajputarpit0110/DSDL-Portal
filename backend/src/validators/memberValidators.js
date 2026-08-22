const ApiError = require('../utils/apiError');

exports.validateProfileInput = (data) => {
  const { visibility } = data;
  if (visibility && !['public', 'private'].includes(visibility)) {
    throw new ApiError(400, 'Visibility must be either public or private');
  }
};
