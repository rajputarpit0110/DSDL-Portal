import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from '../../common/Container';
import SectionHeading from '../../common/SectionHeading';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import AccordionGallery from '../../components/common/AccordionGallery';
import DepthCarousel from '../../components/common/DepthCarousel';
import Threads from '../../components/common/Threads';
import { Brain, Sparkles, BarChart, Monitor, Calendar, Trophy, GitBranch, ChevronRight, Activity } from 'lucide-react';
import { Brain, Sparkles, BarChart, Monitor, Calendar, Trophy, GitBranch, ChevronRight, Activity, Megaphone, Target, Rocket } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';
import { mockAchievements } from '../../data/mockAchievements';
import DriftWall from '../../components/DriftWall';
import TextType from '../../components/TextType';

const Home = () => {
  const [domains, setDomains] = useState([]);
  const [events, setEvents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [members, setMembers] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [activeAchievement, setActiveAchievement] = useState(null);

  const displayAchievements = achievements.length > 0 ? achievements.map((ach, idx) => ({
    ...ach,
    image: ach.image || mockAchievements[idx % mockAchievements.length]?.image || '/achievements/innotech22.png'
  })) : mockAchievements;

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

  const getDomainIcon = (iconName) => {
    switch(iconName) {
      case 'Brain': return <Brain size={32} />;
      case 'Sparkles': return <Sparkles size={32} />;
      case 'BarChart': return <BarChart size={32} />;
      case 'Monitor': return <Monitor size={32} />;
      default: return <Brain size={32} />;
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-background)', position: 'relative' }}>
      
      {/* Global Subtle Grey Grid Background */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 0 }}></div>

      {/* 1. Hero / Banner */}
      <section id="hero" style={{ padding: '8rem 2rem', backgroundColor: 'var(--color-background)', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="/logo/dsdl-logo.webp" alt="DSDL" style={{ height: '120px', marginBottom: '2rem', objectFit: 'contain' }} />
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
          <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', textAlign: 'center', maxWidth: '800px', margin: '0 auto', border: '1px solid var(--color-border)' }}>
            <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--color-text-main)', marginBottom: '1.5rem', fontWeight: '500' }}>
              We are a collective of passionate students dedicated to teaching and guiding our peers in <strong style={{ color: 'var(--color-secondary)' }}>AI, ML, Deep Learning, and Web Development</strong>. We believe in learning by doing.
            </p>
            <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--color-text-main)', fontWeight: '500' }}>
              Whether you need help fixing a bug, want to form a team for an upcoming hackathon, or just want to explore the latest tech trends with like-minded builders—DSDL is your community.
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
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.04) 100%)',
            padding: '2.5rem',
            borderRadius: '24px',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            boxShadow: '0 10px 40px rgba(16, 185, 129, 0.06), inset 0 0 20px rgba(16, 185, 129, 0.02)',
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
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 60%)',
              pointerEvents: 'none',
              zIndex: 0
            }}></div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 1, color: 'var(--color-secondary)', fontWeight: '800', fontSize: '1.75rem', letterSpacing: '0.02em', marginBottom: '0.5rem' }}>
              <Megaphone size={28} style={{ color: 'var(--color-primary)' }} /> Announcement and News
            </div>

            <div style={{ position: 'relative', zIndex: 1, minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TextType 
                text={[
                  "📢 Club Recruitment Starting Soon!",
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
              items={
                domains && domains.length > 0
                  ? domains.map(d => {
                      const slugOrName = (d.slug || d.name || '').toLowerCase();
                      let img = 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1000&q=80';
                      if (slugOrName.includes('web')) {
                        img = 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1000&q=80';
                      } else if (slugOrName.includes('dsa') || slugOrName.includes('algo') || slugOrName.includes('data structure')) {
                        img = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80';
                      } else if (slugOrName.includes('deep') || slugOrName.includes('neural') || slugOrName.includes('nlp')) {
                        img = 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1000&q=80';
                      } else if (slugOrName.includes('android') || slugOrName.includes('app') || slugOrName.includes('mobile')) {
                        img = 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1000&q=80';
                      } else if (slugOrName.includes('machine') || slugOrName.includes('ml') || slugOrName.includes('ai')) {
                        img = 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1000&q=80';
                      }

                      return {
                        image: d.image || img,
                        label: d.name,
                        link: `/domains/${d.slug || d.id}`,
                        alt: d.name
                      };
                    })
                  : [
                      {
                        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1000&q=80',
                        label: 'Machine Learning',
                        link: '/domains/machine-learning',
                        alt: 'Machine Learning'
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
                      }
                    ]
              }
              defaultIndex={2}
              expandRatio={0.5}
              trigger="hover"
              height={480}
              accentColor="var(--color-primary, #0A66C2)"
              overlayColor="#0a0e17"
              radius={16}
            />
          </div>
        </Container>
      </section>

      {/* 4. Events */}
      <section id="events" style={{ padding: '6rem 2rem', position: 'relative', zIndex: 1, backgroundColor: '#060a12', color: '#ffffff', overflow: 'hidden' }}>
        {/* Interactive WebGL Threads Animation Background */}
        <Threads
          color={[0.22, 0.74, 0.97]}
          amplitude={1.2}
          distance={0.2}
          enableMouseInteraction={true}
        />

        <Container style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ marginBottom: '0.85rem' }}>
              <span style={{
                color: 'var(--color-primary, #38bdf8)',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                backgroundColor: 'rgba(10, 102, 194, 0.15)',
                padding: '0.35rem 1rem',
                borderRadius: '999px',
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                LIFE AT DSDL
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(2.4rem, 4vw, 3.25rem)',
              fontWeight: 800,
              maxWidth: '850px',
              margin: '0 auto',
              color: '#ffffff',
              letterSpacing: '-0.02em',
              textShadow: '0 4px 20px rgba(10, 102, 194, 0.4)'
            }}>
              Club Events & <span style={{ color: 'var(--color-primary, #38bdf8)', background: 'linear-gradient(135deg, #38bdf8 0%, #60a5fa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Moments</span>
            </h2>
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
                { image: '/events/event-induction.png', alt: 'DSDL Student Induction Programme' },
                { image: '/events/event-ai-bootcamp.png', alt: 'AI Bootcamp Session Day 1' },
                { image: '/events/event-speaker-sumit.png', alt: 'TFUG x DSDL Collaboration Speaker Sumit Tyagi' },
                { image: '/events/event-group-photo.png', alt: 'DSDL Club Community Group' },
                { image: '/events/event-stickers-swag.png', alt: 'DSDL Tech Vision Stickers & Swag' },
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
            <p style={{
              fontSize: '1.05rem',
              color: 'rgba(255, 255, 255, 0.75)',
              fontWeight: 500,
              maxWidth: '650px',
              margin: '0 auto',
              padding: '0.6rem 1.5rem',
              borderRadius: '999px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'inline-block'
            }}>
              ✨ Celebrating our club’s achievements, events, and memorable moments.
            </p>
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
                  <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.85rem' }}>{event.startTime} • {event.venue}</div>
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
            {projects.slice(0, 3).map(project => (
              <Card key={project.id} style={{ backgroundColor: 'var(--color-background)', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-secondary)', marginBottom: '1rem', fontWeight: 'bold' }}>{project.title}</h3>
                <p style={{ color: 'var(--color-text-main)', lineHeight: '1.6', marginBottom: '1.5rem', flex: 1, fontWeight: '500' }}>{project.description}</p>
                <a href={project.github} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 'bold' }}>
                  <GitBranch size={18} /> View Source
                </a>
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
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
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
                  transition: 'opacity 0.3s ease'
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
              height: '500px',
              position: 'relative',
              borderRadius: '20px',
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
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
      <section id="team" style={{ padding: '6rem 2rem', backgroundColor: 'var(--color-surface)', position: 'relative', zIndex: 1 }}>
        <Container>
          <SectionHeading title="Core Team & Leads" subtitle="The Mentors Behind The Community" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
            {members.filter(m => m.role === 'admin' || m.role === 'lead').map(member => (
              <Card key={member.id} style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--color-background)' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-surface)', margin: '0 auto 1.5rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'var(--color-primary)', border: '1px solid var(--color-border)', fontWeight: 'bold' }}>
                  {member.name.charAt(0)}
                </div>
                <h3 style={{ fontSize: '1.125rem', color: 'var(--color-secondary)', fontWeight: 'bold' }}>{member.name}</h3>
                <p style={{ color: 'var(--color-primary)', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>{member.role}</p>
                <p style={{ color: 'var(--color-text-main)', fontSize: '0.875rem', fontWeight: '500' }}>{member.domain_name || 'General'}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

    </div>
  );
};

export default Home;
