require('dotenv').config();
const { connectDB, getDB } = require('../database/sqlite/connection');
const domainRepository = require('../repositories/domainRepository');

const seedDevelopmentData = async () => {
  try {
    await connectDB();
    console.log('Seeding development data...');

    const sampleDomains = [
      { name: 'Artificial Intelligence', slug: 'ai-ml', description: 'Exploring machine learning and neural networks.', icon: 'Brain' },
      { name: 'Web Development', slug: 'web-dev', description: 'Building the next generation of web applications.', icon: 'Code' },
      { name: 'App Development', slug: 'app-dev', description: 'Creating mobile applications for Android and iOS.', icon: 'Smartphone' },
      { name: 'Cybersecurity', slug: 'cybersecurity', description: 'Protecting systems and networks from digital attacks.', icon: 'Shield' }
    ];

    for (const d of sampleDomains) {
      const exists = await domainRepository.findBySlug(d.slug);
      if (!exists) {
        await domainRepository.create(d);
        console.log(`Created domain: ${d.name}`);
      }
    }

    // Seed Events
    const eventRepository = require('../repositories/eventRepository');
    const sampleEvents = [
      {
        title: 'Tech Genesis Hackathon 2026',
        slug: 'tech-genesis-2026',
        description: 'A 48-hour hackathon to build innovative solutions.',
        type: 'HACKATHON',
        date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: '10:00 AM',
        endTime: '10:00 AM',
        venue: 'Main Auditorium',
        maxParticipants: 100,
        registrationRequired: true,
        status: 'published'
      },
      {
        title: 'Intro to React Workshop',
        slug: 'intro-to-react',
        description: 'Learn the basics of React and Vite.',
        type: 'WORKSHOP',
        date: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: '02:00 PM',
        endTime: '05:00 PM',
        venue: 'Lab 1',
        maxParticipants: 2, // intentionally small to test waitlist
        registrationRequired: true,
        status: 'published'
      }
    ];

    for (const e of sampleEvents) {
      const exists = await eventRepository.findBySlug(e.slug);
      if (!exists) {
        await eventRepository.create(e);
        console.log(`Created event: ${e.title}`);
      }
    }

    // Seed Announcements
    const announcementRepository = require('../repositories/announcementRepository');
    const sampleAnnouncements = [
      {
        title: 'Welcome to the new DSDL Portal!',
        slug: 'welcome-new-portal',
        content: 'We are thrilled to launch our new portal to streamline events, projects, and club management. Explore the domains and start registering for upcoming hackathons!',
        summary: 'The new DSDL portal is live.',
        type: 'NEWS',
        priority: 'HIGH',
        status: 'published',
        publishedAt: new Date().toISOString()
      },
      {
        title: 'Server Maintenance Notice',
        slug: 'server-maintenance-notice',
        content: 'The portal will be down for 2 hours on Sunday midnight for routine maintenance.',
        summary: 'Scheduled downtime on Sunday.',
        type: 'ALERT',
        priority: 'URGENT',
        status: 'published',
        publishedAt: new Date().toISOString(),
        expiresAt: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toISOString() // expires in 3 days
      }
    ];

    for (const a of sampleAnnouncements) {
      const exists = await announcementRepository.findBySlug(a.slug);
      if (!exists) {
        await announcementRepository.create(a);
        console.log(`Created announcement: ${a.title}`);
      }
    }

    // Seed Projects
    const projectRepository = require('../repositories/projectRepository');
    const webDevDomain = await domainRepository.findBySlug('web-dev');
    const db = getDB();
    const adminUser = await db.get('SELECT id FROM users WHERE role = ?', ['admin']);
    
    if (webDevDomain && adminUser) {
      const sampleProjects = [
        {
          title: 'DSDL Club Official Portal',
          slug: 'dsdl-official-portal',
          description: 'The official platform for managing DSDL club activities, members, and events.',
          domainId: webDevDomain.id,
          leadId: adminUser.id,
          teamMembers: ['Jane Doe', 'John Smith'],
          status: 'IN_PROGRESS',
          githubUrl: 'https://github.com/dsdl-club/portal',
          tags: ['React', 'Node.js', 'SQLite']
        }
      ];

      for (const p of sampleProjects) {
        const exists = await projectRepository.findBySlug(p.slug);
        if (!exists) {
          await projectRepository.create(p);
          console.log(`Created project: ${p.title}`);
        }
      }

      // Seed Teams
      const teamRepository = require('../repositories/teamRepository');
      const sampleTeam = {
        name: 'Portal Core Team',
        slug: 'portal-core-team',
        description: 'The dedicated squad building and maintaining the DSDL Portal.',
        domainId: webDevDomain.id,
        leaderId: adminUser.id,
        status: 'active',
        maxMembers: 5
      };

      const existingTeam = await teamRepository.findBySlug(sampleTeam.slug);
      if (!existingTeam) {
        const newTeam = await teamRepository.create(sampleTeam);
        await teamRepository.addMember(newTeam.id, adminUser.id, 'LEADER');
        console.log(`Created team: ${newTeam.name}`);
      }
    }

    // Seed Achievements
    const achievementRepository = require('../repositories/achievementRepository');
    const sampleAchievements = [
      {
        title: 'Smart India Hackathon Winners',
        description: 'Team from DSDL secured 1st position at the national level hackathon solving complex real-world problems.',
        date: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0],
        category: 'Hackathon'
      },
      {
        title: 'Best Tech Club Award',
        description: 'Recognized as the most active technical club by the university for the academic year 2024-2025.',
        date: new Date().toISOString().split('T')[0],
        category: 'Milestone'
      }
    ];

    for (const a of sampleAchievements) {
      const existing = await achievementRepository.findAll();
      const exists = existing.some(ach => ach.title === a.title);
      if (!exists) {
        await achievementRepository.create(a);
        console.log(`Created achievement: ${a.title}`);
      }
    }

    console.log('Development data seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding development data:', error);
    process.exit(1);
  }
};

seedDevelopmentData();
