const ApiError = require('../utils/apiError');

exports.validateEventInput = (data) => {
  const { title, type, date } = data;
  if (!title || title.trim().length === 0) {
    throw new ApiError(400, 'Event title is required');
  }
  if (!type) {
    throw new ApiError(400, 'Event type is required');
  }
  if (!date) {
    throw new ApiError(400, 'Event date is required');
  }
};
