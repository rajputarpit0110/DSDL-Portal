const ApiError = require('../utils/apiError');

exports.validateAnnouncementInput = (data) => {
  const { title, content, type, priority } = data;
  if (!title || title.trim().length === 0) {
    throw new ApiError(400, 'Title is required');
  }
  if (!content || content.trim().length === 0) {
    throw new ApiError(400, 'Content is required');
  }
  if (type && !['NEWS', 'UPDATE', 'ALERT', 'ACHIEVEMENT', 'EVENT', 'OPPORTUNITY'].includes(type)) {
    throw new ApiError(400, 'Invalid type');
  }
  if (priority && !['LOW', 'NORMAL', 'HIGH', 'URGENT'].includes(priority)) {
    throw new ApiError(400, 'Invalid priority');
  }
};
