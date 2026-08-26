import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Container from '../../common/Container';
import SectionHeading from '../../common/SectionHeading';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import AccordionGallery from '../../components/common/AccordionGallery';
import DepthCarousel from '../../components/common/DepthCarousel';
import Threads from '../../components/common/Threads';
import { Brain, Sparkles, BarChart, Monitor, Calendar, Trophy, GitBranch, ChevronRight, Activity, Megaphone, Target, Rocket, ExternalLink } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';
import { mockAchievements } from '../../data/mockAchievements';
import DriftWall from '../../components/DriftWall';
import TextType from '../../components/TextType';
import CardSpread from '../../components/common/CardSpread';
import ProfileSpotlight from '../../components/common/ProfileSpotlight';
const teamPosters = [
  {
    image: '/team/prabhujot.png',
    alt: 'Prabhujot - President',
    name: 'Prabhujot Deshwal',
    role: 'President',
    domain: 'Deep Learning & AI',
    stats: [
      { label: 'Projects', value: '8+' },
      { label: 'Contributions', value: '140+' },
      { label: 'Exp', value: '2 Yrs' }
    ],
    links: [
      { label: 'GitHub Connect', url: 'https://github.com/prabhujot-deshwal', type: 'github' },
      { label: 'LinkedIn Connection', url: 'https://linkedin.com', type: 'linkedin' }
    ]
  },
  {
    image: '/team/rudra.png',
    alt: 'Rudra - Vice President',
    name: 'Rudra Thakur',
    role: 'Vice President',
    domain: 'Machine Learning',
    stats: [
      { label: 'Projects', value: '6+' },
      { label: 'Contributions', value: '110+' },
      { label: 'Exp', value: '1.5 Yrs' }
    ],
    links: [
      { label: 'GitHub Connect', url: 'https://github.com', type: 'github' },
      { label: 'LinkedIn Connection', url: 'https://linkedin.com', type: 'linkedin' }
    ]
  },
  {
    image: '/team/shreyank.png',
    alt: 'Shreyank - DL Lead',
    name: 'Shreyank Pandey',
    role: 'Deep Learning Lead',
    domain: 'Neural Nets & NLP',
    stats: [
      { label: 'Projects', value: '5+' },
      { label: 'Contributions', value: '90+' },
      { label: 'Rank', value: '#3' }
    ],
    links: [
      { label: 'GitHub Connect', url: 'https://github.com', type: 'github' },
      { label: 'LinkedIn Connection', url: 'https://linkedin.com', type: 'linkedin' }
    ]
  },
  {
    image: '/team/vansh.png',
    alt: 'Vansh - ML Lead',
    name: 'Vansh Agarwal',
    role: 'Machine Learning Lead',
    domain: 'Predictive Analytics',
    stats: [
      { label: 'Projects', value: '5+' },
      { label: 'Contributions', value: '95+' },
      { label: 'Rank', value: '#5' }
    ],
    links: [
      { label: 'GitHub Connect', url: 'https://github.com', type: 'github' },
      { label: 'LinkedIn Connection', url: 'https://linkedin.com/in/vansh-agarwal', type: 'linkedin' }
    ]
  },
  {
    image: '/team/ashish.png',
    alt: 'Ashish - Web Lead',
    name: 'Ashish Tiwari',
    role: 'Web Development Lead',
    domain: 'Full Stack & WebGL',
    stats: [
      { label: 'Projects', value: '12+' },
      { label: 'Contributions', value: '240+' },
      { label: 'Rank', value: '#1' }
    ],
    links: [
      { label: 'GitHub Connect', url: 'https://github.com/ashishtiwari', type: 'github' },
      { label: 'LinkedIn Connection', url: 'https://linkedin.com', type: 'linkedin' }
    ]
  }
];

const developersData = [
  {
    name: 'Arpit Rajput',
    photo: '/developer/Arpit Rajput.png',
    linkedin: 'https://www.linkedin.com/in/arpit-rajput-272296365/',
    github: 'https://github.com/rajputarpit0110'
  },
  {
    name: 'Gauri Mishra',
    photo: '/developer/Gauri Mishra.jpeg',
    linkedin: 'https://www.linkedin.com/in/gauri-mshra/',
    github: 'https://github.com/gaurimshra'
  },
  {
    name: 'Aditya Agarwal',
    photo: '/developer/Aditya Agarwal.jpeg',
    linkedin: 'https://www.linkedin.com/in/aditya-agarwal-502546367',
    github: 'https://github.com/Adii-847'
  },
  {
    name: 'Kartik Yadav',
    photo: '/developer/Kartik Yadav.jpeg',
    linkedin: 'https://www.linkedin.com/in/kartik-yadav-b6815b369',
    github: 'https://github.com/kartikDevS'
  },
  {
    name: 'Ujjawal Bansal',
    photo: '/developer/Ujjawal Bansal.png',
    linkedin: 'https://www.linkedin.com/in/ujjawal-bansal-02329b373',
    github: 'https://github.com/ujjawalbansal1002'
  },
  {
    name: 'Rishit Mathur',
    photo: '/developer/Rishit Mathur.png',
    linkedin: 'https://www.linkedin.com/in/rishit-mathur-020312309',
    github: 'https://github.com/rishitmathur8-hub'
  }
];

const DevGithubIcon = ({ size = 20 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const DevLinkedinIcon = ({ size = 20 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const useIntersectionObserver = (ref, options = { threshold: 0.1 }) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        observer.unobserve(entry.target);
      }
    }, options);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);
  return isIntersecting;
};

const DeveloperCard = ({ dev, index }) => {
  const cardRef = React.useRef(null);
  const isVisible = useIntersectionObserver(cardRef);

  return (
    <div
      ref={cardRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`,
        animation: isVisible ? `devFloatBob ${5 + (index % 3) * 0.8}s ease-in-out infinite alternate ${index * 0.15}s` : 'none',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Card
        style={{
          backgroundColor: 'var(--color-surface)',
          padding: '2rem',
          borderRadius: '16px',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          width: '260px',
          transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease'
        }}
      >
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          overflow: 'hidden',
          marginBottom: '1.25rem',
          border: '2px solid var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--color-background)'
        }}>
          <img
            src={dev.photo}
            alt={dev.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: dev.objectPosition || 'top'
            }}
          />
        </div>
        <h4 style={{
          fontSize: '1.25rem',
          color: 'var(--color-secondary)',
          fontWeight: 'bold',
          marginBottom: '0.25rem'
        }}>{dev.name}</h4>
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--color-text-muted)',
          marginBottom: '1.25rem',
          fontWeight: '500'
        }}>Developer</p>
        <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center' }}>
          <a
            href={dev.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--color-text-muted)',
              transition: 'color 0.2s',
              display: 'flex',
              alignItems: 'center'
            }}
            onMouseOver={e => e.currentTarget.style.color = 'var(--color-primary)'}
            onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
          >
            <DevLinkedinIcon size={20} />
          </a>
          <a
            href={dev.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--color-text-muted)',
              transition: 'color 0.2s',
              display: 'flex',
              alignItems: 'center'
            }}
            onMouseOver={e => e.currentTarget.style.color = 'var(--color-primary)'}
            onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
          >
            <DevGithubIcon size={20} />
          </a>
        </div>
      </Card>
    </div>
  );
};

const Home = () => {
  const [domains, setDomains] = useState([]);
  const [events, setEvents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [members, setMembers] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [activeAchievement, setActiveAchievement] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  const displayAchievements = useMemo(() => {
    return achievements.length > 0 ? achievements.map((ach, idx) => ({
      ...ach,
      image: ach.image || mockAchievements[idx % mockAchievements.length]?.image || '/achievements/innotech22.png'
    })) : mockAchievements;
  }, [achievements]);

  const mockProjects = [
    {
      id: 'mock-1',
      title: 'KRIVA Club Official Portal',
      description: 'The official platform for managing KRIVA club activities, members, and events.',
      domain_name: 'Web Development',
      status: 'IN_PROGRESS',
      githubUrl: 'https://github.com/kriva-club/portal',
      liveUrl: 'https://kriva-portal.example.com',
      bannerImage: '/events/event-induction.png',
      tags: ['React', 'Node.js', 'MongoDB']
    },
    {
      id: 'mock-2',
      title: 'AI Crop Yield Predictor',
      description: 'An AI-based agricultural predictor designed to forecast crop yields based on historic soil, weather, and region data.',
      domain_name: 'Artificial Intelligence',
      status: 'COMPLETED',
      githubUrl: 'https://github.com/kriva-club/crop-yield-predictor',
      liveUrl: 'https://crop-predictor.example.com',
      bannerImage: '/events/event-ai-bootcamp.png',
      tags: ['Python', 'PyTorch', 'Scikit-learn', 'Pandas']
    }
  ];

  const displayProjects = projects.length > 0 ? projects.map(p => ({
    ...p,
    domain_name: p.domainId?.name || p.domain_name || 'General',
    githubUrl: p.githubUrl || p.github
  })) : mockProjects;

  useEffect(() => {
    if (displayAchievements && displayAchievements.length > 0 && !activeAchievement) {
      setActiveAchievement(displayAchievements[0]);
    }
  }, [displayAchievements, activeAchievement]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dRes, eRes, pRes, aRes, mRes, achRes] = await Promise.all([
          apiClient.get('/domains'),
          apiClient.get('/events'),
          apiClient.get('/projects'),
          apiClient.get('/announcements'),
          apiClient.get('/members'),
          apiClient.get('/achievements')
        ]);
        setDomains(dRes || []);
        setEvents(eRes || []);
        setProjects(pRes || []);
        setAnnouncements(aRes || []);
        setMembers(mRes || []);
        setAchievements(achRes || []);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      }
    };
    fetchData();
  }, []);

  // Interactive Canvas Particle Network Effect
  useEffect(() => {
    const canvas = document.getElementById('net-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    let pulses = [];
    let mouse = { x: null, y: null };
    let state = 'idle'; // idle, forming, holding, releasing

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Helper to sample points along a path defined by key points
    const samplePath = (keyPoints, totalTargetPoints) => {
      const segments = [];
      let totalLength = 0;
      for (let i = 0; i < keyPoints.length - 1; i++) {
        const dx = keyPoints[i+1][0] - keyPoints[i][0];
        const dy = keyPoints[i+1][1] - keyPoints[i][1];
        const len = Math.hypot(dx, dy);
        segments.push({ start: keyPoints[i], end: keyPoints[i+1], length: len });
        totalLength += len;
      }
      
      const points = [];
      if (totalLength === 0) {
        for (let i = 0; i < totalTargetPoints; i++) {
          points.push({ x: keyPoints[0][0], y: keyPoints[0][1] });
        }
        return points;
      }
      
      const step = totalLength / (totalTargetPoints - 1);
      let currentSegmentIdx = 0;
      let currentSegmentDist = 0;
      
      for (let i = 0; i < totalTargetPoints; i++) {
        const dist = i * step;
        while (currentSegmentIdx < segments.length - 1 && dist > currentSegmentDist + segments[currentSegmentIdx].length) {
          currentSegmentDist += segments[currentSegmentIdx].length;
          currentSegmentIdx++;
        }
        const seg = segments[currentSegmentIdx];
        const t = seg.length > 0 ? (dist - currentSegmentDist) / seg.length : 0;
        const clampedT = Math.max(0, Math.min(1, t));
        const x = seg.start[0] + (seg.end[0] - seg.start[0]) * clampedT;
        const y = seg.start[1] + (seg.end[1] - seg.start[1]) * clampedT;
        points.push({ x, y });
      }
      
      return points;
    };

    // Letter paths in normalized bounds [-0.5, 0.5]
    const keyPoints = {
      K: [[-0.35, -0.5], [-0.35, 0.5], [-0.35, 0], [0.35, -0.5], [-0.35, 0], [0.35, 0.5]],
      R: [[-0.35, 0.5], [-0.35, -0.5], [0.35, -0.5], [0.35, 0], [-0.35, 0], [0.35, 0.5]],
      I: [[0, -0.5], [0, 0.5]],
      V: [[-0.35, -0.5], [0, 0.5], [0.35, -0.5]],
      A: [[-0.35, 0.5], [0, -0.5], [0.35, 0.5], [0.175, 0], [-0.175, 0]]
    };

    const letters = ['K', 'R', 'I', 'V', 'A'];

    // Particle Class
    class Particle {
      constructor(x, y, vx, vy, radius, phase) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.phase = phase;
        this.targetNorm = null;
        this.letterIdx = -1;
        this.pointIdx = -1;
      }

      update(logicalWidth, logicalHeight) {
        if (isReducedMotion) return;

        if ((state === 'forming' || state === 'holding') && this.targetNorm) {
          const S = Math.min(logicalWidth, logicalHeight) * 0.09;
          const spacing = 1.4 * S;
          const letterCenterX = logicalWidth / 2 + (this.letterIdx - 2) * spacing;
          const letterCenterY = logicalHeight / 2;
          
          const targetX = letterCenterX + this.targetNorm.x * S;
          const targetY = letterCenterY + this.targetNorm.y * S;
          
          const lerpFactor = 0.06;
          this.x += (targetX - this.x) * lerpFactor;
          this.y += (targetY - this.y) * lerpFactor;
        } else {
          this.x += this.vx;
          this.y += this.vy;

          if (this.x < -10) this.x = logicalWidth + 10;
          else if (this.x > logicalWidth + 10) this.x = -10;
          if (this.y < -10) this.y = logicalHeight + 10;
          else if (this.y > logicalHeight + 10) this.y = -10;

          if (mouse.x !== null && mouse.y !== null) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 110 && dist > 0.1) {
              const pushForce = (1.0 - dist / 110) * 0.8;
              this.x += (dx / dist) * pushForce;
              this.y += (dy / dist) * pushForce;
            }
          }
        }
      }

      draw(timestamp) {
        const time = timestamp * 0.002;
        const opacity = 0.35 + (Math.sin(time + this.phase) + 1.0) * 0.5 * (0.8 - 0.35);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(248, 113, 113, ${opacity * 0.22})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(248, 113, 113, ${opacity})`;
        ctx.fill();
      }
    }

    // Pulse Class
    class Pulse {
      constructor(startNode, endNode, speed) {
        this.startNode = startNode;
        this.endNode = endNode;
        this.speed = speed;
        this.t = 0;
      }

      update() {
        this.t += this.speed;
        return this.t >= 1;
      }

      draw() {
        const x = this.startNode.x + (this.endNode.x - this.startNode.x) * this.t;
        const y = this.startNode.y + (this.endNode.y - this.startNode.y) * this.t;
        const alpha = Math.sin(this.t * Math.PI);

        ctx.beginPath();
        ctx.arc(x, y, 6.0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(248, 113, 113, ${alpha * 0.28})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(248, 113, 113, ${alpha * 0.95})`;
        ctx.fill();
      }
    }

    const assignTargets = () => {
      particles.forEach(p => {
        p.targetNorm = null;
        p.letterIdx = -1;
        p.pointIdx = -1;
      });

      const shuffled = [...particles].sort(() => 0.5 - Math.random());
      let particleCounter = 0;
      
      for (let lIdx = 0; lIdx < letters.length; lIdx++) {
        const letter = letters[lIdx];
        const letterPts = samplePath(keyPoints[letter], 16);
        for (let ptIdx = 0; ptIdx < letterPts.length; ptIdx++) {
          if (particleCounter < shuffled.length) {
            const p = shuffled[particleCounter];
            p.targetNorm = letterPts[ptIdx];
            p.letterIdx = lIdx;
            p.pointIdx = ptIdx;
            particleCounter++;
          }
        }
      }
    };

    const releaseTargets = (logicalWidth, logicalHeight) => {
      particles.forEach(p => {
        if (p.targetNorm) {
          const S = Math.min(logicalWidth, logicalHeight) * 0.09;
          const spacing = 1.4 * S;
          const letterCenterX = logicalWidth / 2 + (p.letterIdx - 2) * spacing;
          const letterCenterY = logicalHeight / 2;
          
          const dx = p.x - letterCenterX;
          const dy = p.y - letterCenterY;
          const dist = Math.hypot(dx, dy) || 1;
          
          const speed = 1.5 + Math.random() * 2.0;
          p.vx = (dx / dist) * speed;
          p.vy = (dy / dist) * speed;

          p.targetNorm = null;
          p.letterIdx = -1;
          p.pointIdx = -1;
        }
      });
    };

    const initParticles = (count, logicalWidth, logicalHeight) => {
      pulses = [];
      const newParticles = [];
      for (let i = 0; i < count; i++) {
        const radius = 1.0 + Math.random() * 0.6;
        const x = Math.random() * logicalWidth;
        const y = Math.random() * logicalHeight;
        const speed = 0.08 + Math.random() * 0.08;
        const angle = Math.random() * Math.PI * 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const phase = Math.random() * Math.PI * 2;
        newParticles.push(new Particle(x, y, vx, vy, radius, phase));
      }
      particles = newParticles;

      if (state === 'forming' || state === 'holding') {
        assignTargets();
      }
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
      const count = Math.min(Math.max(Math.floor((rect.width * rect.height) / 18000), 85), 120);
      initParticles(count, rect.width, rect.height);
    };

    const connectParticles = () => {
      const maxDistance = 150;
      const isFormingOrHolding = (state === 'forming' || state === 'holding');
      
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          
          let shouldConnect = false;
          let isGlyphConnection = false;
          let dist = 0;
          
          if (isFormingOrHolding) {
            if (p1.letterIdx !== -1 && p2.letterIdx !== -1) {
              if (p1.letterIdx === p2.letterIdx && Math.abs(p1.pointIdx - p2.pointIdx) === 1) {
                shouldConnect = true;
                isGlyphConnection = true;
                dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
              }
            } else if (p1.letterIdx === -1 && p2.letterIdx === -1) {
              dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
              if (dist < maxDistance) {
                shouldConnect = true;
              }
            }
          } else {
            dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
            if (dist < maxDistance) {
              shouldConnect = true;
            }
          }
          
          if (shouldConnect) {
            let alpha = isGlyphConnection ? 0.85 : Math.min((1.0 - dist / maxDistance) * 0.28, 0.55);
            ctx.strokeStyle = `rgba(220, 38, 38, ${alpha})`;
            ctx.lineWidth = isGlyphConnection ? 1.5 : 0.65;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    };

    const cycleDuration = 13000;

    const animate = (timestamp) => {
      const rect = canvas.getBoundingClientRect();
      const logicalWidth = rect.width;
      const logicalHeight = rect.height;

      ctx.clearRect(0, 0, logicalWidth, logicalHeight);

      if (!isReducedMotion) {
        const elapsedCycle = (timestamp % cycleDuration);

        if (elapsedCycle < 4500) {
          if (state !== 'idle') {
            state = 'idle';
            releaseTargets(logicalWidth, logicalHeight);
          }
        } else if (elapsedCycle < 6500) {
          if (state !== 'forming') {
            state = 'forming';
            assignTargets();
          }
        } else if (elapsedCycle < 10500) {
          state = 'holding';
        } else if (elapsedCycle < 12000) {
          if (state !== 'releasing') {
            state = 'releasing';
            releaseTargets(logicalWidth, logicalHeight);
          }
        } else {
          state = 'idle';
        }
      } else {
        state = 'idle';
      }

      particles.forEach(p => {
        p.update(logicalWidth, logicalHeight);
        p.draw(timestamp);
      });

      connectParticles();

      if (!isReducedMotion && Math.random() < 0.02 && particles.length > 0) {
        const startNode = particles[Math.floor(Math.random() * particles.length)];
        let nearestNode = null;
        let minDist = 150;

        particles.forEach(p => {
          if (p === startNode) return;
          const dist = Math.hypot(p.x - startNode.x, p.y - startNode.y);
          if (dist < minDist) {
            minDist = dist;
            nearestNode = p;
          }
        });

        if (nearestNode) {
          const speed = 0.012 + Math.random() * (0.022 - 0.012);
          pulses.push(new Pulse(startNode, nearestNode, speed));
        }
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        const finished = pulse.update();
        if (finished) {
          pulses.splice(i, 1);
        } else {
          pulse.draw();
        }
      }

      if (!isReducedMotion) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    resizeCanvas();
    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      const targetId = window.location.hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          const navHeight = 70;
          const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - navHeight;
          window.scrollTo({
            top: offsetPosition > 0 ? offsetPosition : 0,
            behavior: 'smooth'
          });
        }, 150);
      }
    }
  }, []);

  const getDomainIcon = (iconName) => {
    switch (iconName) {
      case 'Brain': return <Brain size={32} />;
      case 'Sparkles': return <Sparkles size={32} />;
      case 'BarChart': return <BarChart size={32} />;
      case 'Monitor': return <Monitor size={32} />;
      default: return <Brain size={32} />;
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-background)', position: 'relative' }}>
      {/* Homepage Premium Animated Background */}
      <div className="homepage-bg">
        <canvas id="net-canvas"></canvas>
        <div className="mesh-blob mesh-blob-1"></div>
        <div className="mesh-blob mesh-blob-2"></div>
        <div className="mesh-blob mesh-blob-3"></div>
        <div className="vignette"></div>
        <div className="grain"></div>
      </div>

      {/* 1. Hero / Banner */}
      <section id="hero" style={{ padding: '8rem 2rem', backgroundColor: 'var(--color-background)', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="/logo/kriva-logo.webp" alt="KRIVA" style={{ height: '120px', marginBottom: '2rem', objectFit: 'contain' }} />
          <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '1.5rem', lineHeight: 1.1, color: 'var(--color-secondary)' }}>
            Build, Learn, <span style={{ color: 'var(--color-primary)' }}>Innovate</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--color-text-main)', maxWidth: '600px', margin: '0 auto 3rem auto', lineHeight: 1.6, fontWeight: '500' }}>
            The premier tech community at KIET focused on mentoring, exploring modern technologies, and building real-world solutions together.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href="#domains" className="btn btn-primary">Explore Domains</a>
            <Link to="/login" className="btn" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-secondary)', border: '1px solid var(--color-border)' }}>Member Login</Link>
          </div>
        </Container>
      </section>

      {/* 2. About / Mission */}
      <section id="about" style={{ padding: '6rem 2rem', position: 'relative', zIndex: 1 }}>
        <Container>
          <SectionHeading title="Who We Are" subtitle="Mentorship, Community, Innovation" />
          <div style={{ backgroundColor: 'var(--panel-solid)', padding: '3rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)', textAlign: 'center', maxWidth: '800px', margin: '0 auto', border: '1px solid var(--color-border)' }}>
            <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--color-text-main)', marginBottom: '1.5rem', fontWeight: '500' }}>
              We are a collective of passionate students dedicated to teaching and guiding our peers in <strong style={{ color: 'var(--color-primary-hover)' }}>AI, ML, Deep Learning, and Web Development</strong>. We believe in learning by doing.
            </p>
            <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--color-text-muted)', fontWeight: '500' }}>
              Whether you need help fixing a bug, want to form a team for an upcoming hackathon, or just want to explore the latest tech trends with like-minded builders—KRIVA is your community.
            </p>
          </div>
        </Container>
      </section>

      {/* 1.5. Announcements Section */}
      <section id="announcements-typing" style={{ padding: '4rem 2rem', position: 'relative', zIndex: 1 }}>
        <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: '100%',
            maxWidth: '650px',
            background: 'linear-gradient(135deg, var(--void) 0%, var(--panel-solid) 100%)',
            padding: '2.5rem',
            borderRadius: '24px',
            border: '1px solid rgba(220, 38, 38, 0.5)',
            boxShadow: `
  0 0 20px rgba(220, 38, 38, 0.20),
  0 0 45px rgba(220, 38, 38, 0.16),
  0 0 90px rgba(248, 113, 113, 0.12),
  0 15px 50px rgba(0, 0, 0, 0.35),
  inset 0 0 30px rgba(220, 38, 38, 0.06)
`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center'
          }}>
            {/* Glow effect background */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(220, 38, 38, 0.05) 0%, transparent 60%)',
              pointerEvents: 'none',
              zIndex: 0
            }}></div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 1, color: 'var(--color-secondary)', fontWeight: '800', fontSize: '1.75rem', letterSpacing: '0.02em', marginBottom: '0.5rem' }}>
              <Megaphone size={28} style={{ color: 'var(--color-primary)' }} /> Announcement and News
            </div>

            <div style={{ position: 'relative', zIndex: 1, minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TextType
                text={[
                  "📢Club Recruitment Starting Soon!",
                  "Stay Tuned • Registration Opening Soon 🚀"
                ]}
                typingSpeed={60}
                deletingSpeed={30}
                pauseDuration={2000}
                loop={true}
                showCursor={true}
                cursorCharacter="|"
                textColors={['var(--color-secondary)', 'var(--color-primary)']}
                style={{
                  fontSize: '1.8rem',
                  fontWeight: '800',
                  lineHeight: '1.4',
                  fontFamily: 'system-ui, sans-serif'
                }}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Domains */}
      <section id="domains" style={{ padding: '6rem 2rem', backgroundColor: 'var(--color-surface)', position: 'relative', zIndex: 1 }}>
        <Container>
          <SectionHeading title="Technical Domains" subtitle="Explore Our Core Technology Tracks & Mentorship Areas" />

          <div style={{ marginTop: '2rem', width: '100%' }}>
            <AccordionGallery
              items={[
                {
                  image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1000&q=80',
                  label: 'Machine Learning',
                  link: '/domains/machine-learning',
                  alt: 'Machine Learning'
                },
                {
                  image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1000&q=80',
                  label: 'Deep Learning',
                  link: '/domains/deep-learning',
                  alt: 'Deep Learning'
                },
                {
                  image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1000&q=80',
                  label: 'Android Development',
                  link: '/domains/android-development',
                  alt: 'Android Development'
                },
                {
                  image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1000&q=80',
                  label: 'Web Development',
                  link: '/domains/web-development',
                  alt: 'Web Development'
                },
                {
                  image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
                  label: 'DSA',
                  link: '/domains/dsa',
                  alt: 'Data Structures and Algorithms'
                }
              ]}
              defaultIndex={2}
              expandRatio={0.5}
              trigger="hover"
              height={480}
              accentColor="#3b82f6"
              overlayColor="#0a0303"
              radius={16}
            />
          </div>
        </Container>
      </section>

      {/* 4. Events */}
      <section id="events" style={{ padding: '6rem 2rem', position: 'relative', zIndex: 1, backgroundColor: 'var(--void)', color: '#ffffff', overflow: 'hidden' }}>
        {/* Interactive WebGL Threads Animation Background */}
        <Threads
          color={[0.86, 0.15, 0.15]}
          amplitude={1.2}
          distance={0.2}
          enableMouseInteraction={true}
        />

        <Container style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ marginBottom: '0.85rem' }}>
              <span style={{
                color: 'var(--color-primary, #dc2626)',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                backgroundColor: 'rgba(220, 38, 38, 0.15)',
                padding: '0.35rem 1rem',
                borderRadius: '999px',
                border: '1px solid rgba(220, 38, 38, 0.3)'
              }}>
                LIFE AT KRIVA
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(2.4rem, 4vw, 3.25rem)',
              fontWeight: 800,
              maxWidth: '850px',
              margin: '0 auto',
              color: '#ffffff',
              letterSpacing: '-0.02em',
              textShadow: '0 4px 20px rgba(220, 38, 38, 0.4)'
            }}>
              Club Events & <span style={{ color: 'var(--color-primary, #dc2626)', background: 'linear-gradient(135deg, #dc2626 0%, #f87171 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Moments</span></h2>
            <p style={{
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: '1.2rem',
              maxWidth: '750px',
              margin: '1rem auto 0 auto',
              fontWeight: 500,
              lineHeight: 1.6
            }}>
              Explore Our Bootcamps, Expert Sessions & Hackathons in 3D Depth
            </p>
          </div>

          {/* Interactive 3D Depth Carousel of Events */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '520px',
            margin: '1rem 0 1rem 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <DepthCarousel
              items={[
                { image: '/events/event-induction.png', alt: 'KRIVA Student Induction Programme' },
                { image: '/events/event-ai-bootcamp.png', alt: 'AI Bootcamp Session Day 1' },
                { image: '/events/event-speaker-sumit.png', alt: 'TFUG x KRIVA Collaboration Speaker Sumit Tyagi' },
                { image: '/events/event-group-photo.png', alt: 'KRIVA Club Community Group' },
                { image: '/events/event-stickers-swag.png', alt: 'KRIVA Tech Vision Stickers & Swag' },
                { image: '/events/event-workshop-audience.png', alt: 'Hands-on Tech Workshop Audience' },
                { image: '/events/event-speaker-session.png', alt: 'Keynote Speaker & AI Mentorship' },
                { image: '/events/event-session.png', alt: 'Collaborative Lab Session' }
              ]}
              cardWidth={320}
              cardHeight={400}
              depth={220}
              spread={90}
              tilt={22}
              tiltDirection="right"
              perspective={1400}
              visibleCards={4}
              falloff={0.2}
              blur={6}
              autoplay={true}
              autoplayDelay={3500}
              loop={true}
              showControls={true}
              showIndicators={true}
            />
          </div>

          {/* Bottom Subtitle / Tagline below the image carousel */}
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>

          </div>

          {/* Event Cards Listing */}
          <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '850px', margin: '0 auto' }}>
            {events.slice(0, 3).map(event => (
              <Card key={event.id} style={{ padding: '1.75rem', display: 'flex', gap: '1.5rem', alignItems: 'center', backgroundColor: '#0d1322', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ backgroundColor: 'rgba(10, 102, 194, 0.15)', padding: '1rem', borderRadius: '14px', textAlign: 'center', minWidth: '85px', border: '1px solid rgba(10, 102, 194, 0.3)' }}>
                  <Calendar size={24} style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }} />
                  <div style={{ fontWeight: 'bold', color: '#ffffff', fontSize: '0.9rem' }}>{new Date(event.date).toLocaleDateString()}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.25rem', color: '#ffffff', fontWeight: 'bold' }}>{event.title}</h3>
                    <Badge variant="primary">{event.type}</Badge>
                  </div>
                  <p style={{ color: 'rgba(255, 255, 255, 0.75)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>{event.description}</p>
                  <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.85rem' }}>{event.startTime} ΓÇó {event.venue}</div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>


      {/* 6. Projects */}
      <section id="projects" style={{ padding: '6rem 2rem', backgroundColor: 'var(--color-surface)', position: 'relative', zIndex: 1 }}>
        <Container>
          <SectionHeading title="Club Projects" subtitle="Things we build together as a community." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {displayProjects.slice(0, 3).map(project => (
              <Card key={project.id} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '600px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <Badge color='var(--color-primary)'>{project.domain_name || 'General'}</Badge>
                  {project.status && (
                    <span style={{ fontSize: '0.75rem', color: project.status === 'COMPLETED' ? '#10b981' : '#f59e0b', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      {project.status.replace('_', ' ')}
                    </span>
                  )}
                </div>
                {project.bannerImage && (
                  <div style={{ width: '100%', height: '160px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.25rem' }}>
                    <img src={project.bannerImage} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                  </div>
                )}
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-secondary)', marginBottom: '0.75rem' }}>{project.title}</h3>
                <p style={{ color: 'var(--color-text-main)', marginBottom: '1.5rem', lineHeight: '1.6', flex: 1 }}>{project.description}</p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {project.tags && project.tags.map(tag => (
                    <span key={tag} style={{ fontSize: '0.75rem', backgroundColor: 'var(--panel)', padding: '0.25rem 0.5rem', borderRadius: '4px', color: 'var(--text-muted)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
                      <GitBranch size={18} /> Source Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', textDecoration: 'none', fontSize: '0.875rem' }}>
                      <ExternalLink size={18} /> Live Demo
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 6. Achievements */}
      <section id="achievements" style={{ padding: '6rem 2rem', position: 'relative', zIndex: 1 }}>
        <Container>
          <SectionHeading title="Our Achievements" subtitle="Celebrating Our Wins" />
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '3rem',
            alignItems: 'stretch',
            justifyContent: 'center',
            marginTop: '3rem'
          }}>
            {/* Left Panel: Active achievement details */}
            <div style={{
              flex: '1 1 400px',
              maxWidth: '550px',
              height: '650px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {(activeAchievement || displayAchievements[0]) && (
                <div style={{
                  padding: '2.5rem',
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: '20px',
                  border: '1px solid var(--color-border)',
                  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  transition: 'opacity 0.3s ease',
                  height: '100%',
                  overflowY: 'auto'
                }}>
                  {(activeAchievement || displayAchievements[0]).image && (
                    <div style={{
                      width: '100%',
                      maxHeight: '340px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      marginBottom: '1rem',
                      backgroundColor: '#0a0a14',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--color-border)'
                    }}>
                      <img
                        src={(activeAchievement || displayAchievements[0]).image}
                        alt={(activeAchievement || displayAchievements[0]).title}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '340px',
                          width: 'auto',
                          height: 'auto',
                          objectFit: 'contain',
                          display: 'block'
                        }}
                      />
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      color: 'var(--color-primary)',
                      padding: '0.35rem 0.85rem',
                      borderRadius: '9999px',
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}>
                      {(activeAchievement || displayAchievements[0]).category}
                    </span>
                    {(activeAchievement || displayAchievements[0]).date && (
                      <span style={{
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: 'var(--color-text-muted)',
                        backgroundColor: 'var(--color-background)',
                        padding: '0.35rem 0.85rem',
                        borderRadius: '9999px',
                        border: '1px solid var(--color-border)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <Calendar size={12} /> {(activeAchievement || displayAchievements[0]).date}
                      </span>
                    )}
                  </div>

                  <h3 style={{
                    fontSize: '2rem',
                    fontWeight: '800',
                    color: 'var(--color-secondary)',
                    lineHeight: '1.25',
                    background: 'linear-gradient(135deg, var(--color-secondary) 30%, var(--color-primary) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    margin: '0.5rem 0'
                  }}>
                    {(activeAchievement || displayAchievements[0]).title}
                  </h3>

                  <p style={{
                    color: 'var(--color-text-main)',
                    lineHeight: '1.75',
                    fontSize: '1rem',
                    fontWeight: '500',
                    margin: 0
                  }}>
                    {(activeAchievement || displayAchievements[0]).description}
                  </p>
                </div>
              )}
            </div>

            {/* Right Panel: DriftWall */}
            <div style={{
              flex: '1 1 400px',
              maxWidth: '550px',
              height: '650px',
              position: 'relative',
              borderRadius: '20px',
              border: '1px solid var(--color-border)',
              overflow: 'auto',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
              backgroundColor: '#05030a'
            }}>
              <DriftWall
                items={displayAchievements}
                columns={3}
                tileWidth={170}
                tileHeight={120}
                gap={14}
                tilt={12}
                turn={-10}
                perspective={1000}
                depth={100}
                speed={35}
                fade={0.6}
                dim={0.45}
                overlayColor="#05030a"
                onActiveItemChange={(item) => {
                  if (item) setActiveAchievement(item);
                }}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* 7. Members / Team */}
      <section id="team" style={{ padding: '6rem 2rem', backgroundColor: 'var(--color-surface)', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        <Container>
          <SectionHeading title="Core Team & Leads" subtitle="The Mentors Behind The Community" />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '1rem', width: '100%', marginBottom: '4rem' }}>
            <CardSpread
              items={teamPosters}
              cardWidth={285}
              cardHeight={390}
              xSpacingSpread={160}
              xSpacingCollapse={18}
              onCardClick={(item) => setSelectedMember(item)}
            />
          </div>

        </Container>

        {/* Profile Spotlight Dialog Card Overlay */}
        <ProfileSpotlight
          member={selectedMember}
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      </section>

      {/* 7.5. Developers */}
      <section id="developers" style={{ padding: '6rem 2rem', backgroundColor: 'var(--color-background)', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        <Container>
          <SectionHeading title="Developers" subtitle="The Technical Minds Behind the Platform" />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2.5rem',
            justifyContent: 'center',
            justifyItems: 'center',
            marginTop: '3rem'
          }}>
            {developersData.map((dev, idx) => (
              <DeveloperCard key={dev.name} dev={dev} index={idx} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;
