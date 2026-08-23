const Notification = require('../models/Notification');

class NotificationRepository {
  async findByUserId(userId) {
    return await Notification.find({ receiver: userId }).sort({ createdAt: -1 });
  }

  async countUnread(userId) {
    return await Notification.countDocuments({ receiver: userId, isRead: false });
  }

  async create(data) {
    const notification = new Notification(data);
    return await notification.save();
  }

  async markAsRead(id, userId) {
    return await Notification.findOneAndUpdate(
      { _id: id, receiver: userId },
      { isRead: true },
      { new: true }
    );
  }

  async markAllAsRead(userId) {
    return await Notification.updateMany(
      { receiver: userId, isRead: false },
      { isRead: true }
    );
  }

  async delete(id, userId) {
    await Notification.findOneAndDelete({ _id: id, receiver: userId });
    return true;
  }
}

module.exports = new NotificationRepository();
