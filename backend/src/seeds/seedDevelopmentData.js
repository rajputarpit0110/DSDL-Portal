require('dotenv').config();
const { connectDB } = require('../database/mongo/connection');
const domainRepository = require('../repositories/domainRepository');
const eventRepository = require('../repositories/eventRepository');
const announcementRepository = require('../repositories/announcementRepository');
const projectRepository = require('../repositories/projectRepository');
const teamRepository = require('../repositories/teamRepository');
const achievementRepository = require('../repositories/achievementRepository');
const User = require('../models/User');

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
        maxParticipants: 2,
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
        expiresAt: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    for (const a of sampleAnnouncements) {
      const exists = await announcementRepository.findBySlug(a.slug);
      if (!exists) {
        await announcementRepository.create(a);
        console.log(`Created announcement: ${a.title}`);
      }
    }

    const webDevDomain = await domainRepository.findBySlug('web-dev');
    const adminUser = await User.findOne({ role: 'admin' });
    
    if (webDevDomain && adminUser) {
      const sampleProjects = [
        {
          title: 'DSDL Club Official Portal',
          slug: 'dsdl-official-portal',
          description: 'The official platform for managing DSDL club activities, members, and events.',
          domainId: webDevDomain.id || webDevDomain._id,
          leadId: adminUser.id || adminUser._id,
          teamMembers: ['Jane Doe', 'John Smith'],
          status: 'IN_PROGRESS',
          githubUrl: 'https://github.com/dsdl-club/portal',
          tags: ['React', 'Node.js', 'MongoDB']
        }
      ];

      for (const p of sampleProjects) {
        const exists = await projectRepository.findBySlug(p.slug);
        if (!exists) {
          await projectRepository.create(p);
          console.log(`Created project: ${p.title}`);
        }
      }

      const sampleTeam = {
        name: 'Portal Core Team',
        slug: 'portal-core-team',
        description: 'The dedicated squad building and maintaining the DSDL Portal.',
        domainId: webDevDomain.id || webDevDomain._id,
        leaderId: adminUser.id || adminUser._id,
        status: 'active',
        maxMembers: 5
      };

      const existingTeam = await teamRepository.findBySlug(sampleTeam.slug);
      if (!existingTeam) {
        const newTeam = await teamRepository.create(sampleTeam);
        await teamRepository.addMember(newTeam.id || newTeam._id, adminUser.id || adminUser._id, 'LEADER');
        console.log(`Created team: ${newTeam.name}`);
      }
    }

    const sampleAchievements = [
      {
        title: 'Innotech-22 Winner',
        description: 'Rohit and Vartul, with Rohit being a member of the DSDL Club, showcased their prowess at Innotech-22, winning accolades for their innovative contributions. Their victory underscores the impact of collaboration and the cutting-edge insights fostered within technology-focused clubs, reaffirming their commitment to excellence in the field.',
        date: '2022-11-18',
        category: 'Societal Category',
        image: '/achievements/innotech22.png'
      },
      {
        title: 'TechHacks 3.0',
        description: 'Kanisk Jaiswal, a key member of the DSDL Club, achieved the 1st Runner-Up position with cash prize of 10k at Techhacks 3.0, Chitkara University held on 5-6 January 2023. Collaborating with the talented team of Piyush Sharma, Khushi Sachdev, and Sampada, they showcased exceptional skills and innovation. Congratulations to the DSDL Club for yet another remarkable triumph in the dynamic world of technology.',
        date: '2023-01-06',
        category: 'Hackathon',
        image: '/achievements/techhacks30.png'
      },
      {
        title: 'NASA Space Apps',
        description: 'Kanisk Jaiswal, a standout member of the DSDL Club, led the team to become the global nominee and secure an impressive 3rd position in the Greater Noida region with cash prize of 5K held on 2nd-3rd October 2022. Collaborating with the talented team of Shivansh Pandey, Garima Shukla, Manas and their innovative prowess shone brightly.',
        date: '2022-10-03',
        category: 'Global Hackathon',
        image: '/achievements/nasaspaceapps.png'
      },
      {
        title: 'Ideathon ISABVP',
        description: 'Anuj Gupta, Manisha Maurya a standout members of the DSDL Club, led the team to secure the 3rd position in the ideathon organized by ISABVP. Alongside the talented team of Akshat Srivastava and Ira Nafees for their innovative performance.',
        date: '2023-03-15',
        category: 'Ideathon',
        image: '/achievements/ideathonisabvp.png'
      },
      {
        title: 'Best Tech Club of the Year',
        description: 'Awarded by KIET Group of Institutions for conducting maximum technical workshops and real-world projects.',
        date: '2024-06-15',
        category: 'College Award',
        image: '/achievements/besttechclub.jpg'
      },
      {
        title: '1st Runner-Up at Smart India Hackathon',
        description: 'The DSDL Alpha team secured the 1st runner-up position for building an AI-based agriculture yield predictor.',
        date: '2025-12-15',
        category: 'National Hackathon',
        image: '/achievements/sih2025_stage.jpg'
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