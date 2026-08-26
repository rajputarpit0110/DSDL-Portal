require('dotenv').config();
const { connectDB } = require('../database/mongo/connection');
const User = require('../models/User');
const Announcement = require('../models/Announcement');
const Notification = require('../models/Notification');

const seedNotifications = async () => {
  try {
    await connectDB();
    console.log('Seeding initial notifications connected to announcements...');

    const users = await User.find();
    if (users.length === 0) {
      console.log('No users found to seed notifications for.');
      process.exit(0);
    }

    const announcements = await Announcement.find({ status: 'published' });

    for (const user of users) {
      for (const ann of announcements) {
        const existing = await Notification.findOne({
          receiver: user._id,
          relatedEntity: 'Announcement',
          relatedEntityId: ann._id
        });

        if (!existing) {
          await Notification.create({
            receiver: user._id,
            type: 'ANNOUNCEMENT',
            title: ann.title,
            message: ann.summary || (ann.content ? ann.content.slice(0, 140) + '...' : 'Check out the new announcement on the portal.'),
            relatedEntity: 'Announcement',
            relatedEntityId: ann._id,
            isRead: false,
            createdAt: ann.publishedAt || ann.createdAt || new Date()
          });
          console.log(`Created announcement notification for ${user.email} (${user.role}): "${ann.title}"`);
        }
      }

      // Welcome Notification if none exists
      const welcomeExists = await Notification.findOne({
        receiver: user._id,
        type: 'WELCOME'
      });

      if (!welcomeExists) {
        let welcomeMsg = 'Welcome to the DSDL Portal! Explore upcoming events and club projects.';
        if (user.role === 'lead') {
          welcomeMsg = 'Welcome Lead! You have elevated privileges to oversee domain projects, announcements, and track team progress.';
        } else if (user.role === 'admin') {
          welcomeMsg = 'Welcome Admin! Manage global events, users, domain tracks, and broadcast announcements.';
        }

        await Notification.create({
          receiver: user._id,
          type: 'WELCOME',
          title: `Welcome to DSDL Portal, ${user.name.split(' ')[0]}!`,
          message: welcomeMsg,
          isRead: false
        });
      }
    }

    console.log('Notifications seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding notifications:', error);
    process.exit(1);
  }
};

seedNotifications();
