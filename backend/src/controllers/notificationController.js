const notificationRepository = require('../repositories/notificationRepository');
const ApiResponse = require('../utils/apiResponse');

exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await notificationRepository.findByUserId(req.user.userId);
    res.status(200).json(new ApiResponse(200, 'Notifications fetched', notifications));
  } catch (error) {
    next(error);
  }
};

exports.getUnreadCount = async (req, res, next) => {
  try {
    const count = await notificationRepository.countUnread(req.user.userId);
    res.status(200).json(new ApiResponse(200, 'Unread count fetched', { count }));
  } catch (error) {
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await notificationRepository.markAsRead(req.params.id, req.user.userId);
    res.status(200).json(new ApiResponse(200, 'Notification marked as read', notification));
  } catch (error) {
    next(error);
  }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    await notificationRepository.markAllAsRead(req.user.userId);
    res.status(200).json(new ApiResponse(200, 'All notifications marked as read', {}));
  } catch (error) {
    next(error);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    await notificationRepository.delete(req.params.id, req.user.userId);
    res.status(200).json(new ApiResponse(200, 'Notification deleted', {}));
  } catch (error) {
    next(error);
  }
};
