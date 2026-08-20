import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../../common/Container';
import SectionHeading from '../../common/SectionHeading';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import { mockDomains } from '../../data/mockDomains';
import { mockEvents } from '../../data/mockEvents';
import { mockProjects } from '../../data/mockProjects';
import { mockAchievements } from '../../data/mockAchievements';
import { mockMembers } from '../../data/mockMembers';
import { Brain, Sparkles, BarChart, Monitor, Calendar, Trophy, GitBranch, ChevronRight } from 'lucide-react';

const Home = () => {
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

      {/* 3. Domains */}
      <section id="domains" style={{ padding: '6rem 2rem', backgroundColor: 'var(--color-surface)', position: 'relative', zIndex: 1 }}>
        <Container>
          <SectionHeading title="Tech Domains" subtitle="Areas We Explore & Teach" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {mockDomains.map(domain => (
              <Link to={`/domain/${domain.id}`} key={domain.id} style={{ textDecoration: 'none' }}>
                <Card style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%', transition: 'transform 0.2s', cursor: 'pointer', backgroundColor: 'var(--color-background)' }} 
                      onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'none'}>
                  <div style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
                    {getDomainIcon(domain.iconName)}
                  </div>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--color-secondary)', marginBottom: '1rem', fontWeight: 'bold' }}>{domain.name}</h3>
                  <p style={{ color: 'var(--color-text-main)', lineHeight: '1.6', flex: 1, fontWeight: '500' }}>{domain.shortDesc}</p>
                  <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>
                    Learn More <ChevronRight size={18} />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Events */}
      <section id="events" style={{ padding: '6rem 2rem', position: 'relative', zIndex: 1 }}>
        <Container>
          <SectionHeading title="Club Events" subtitle="Hackathons, Workshops & Meetups" />
          <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            {mockEvents.slice(0, 3).map(event => (
              <Card key={event.id} style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center', backgroundColor: 'var(--color-background)' }}>
                <div style={{ backgroundColor: 'var(--color-surface)', padding: '1rem', borderRadius: '12px', textAlign: 'center', minWidth: '80px', border: '1px solid var(--color-border)' }}>
                  <Calendar size={24} style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }} />
                  <div style={{ fontWeight: 'bold', color: 'var(--color-secondary)' }}>{event.date.split(' ')[0]}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', color: 'var(--color-secondary)', fontWeight: 'bold' }}>{event.title}</h3>
                    <Badge color={event.status === 'upcoming' ? 'var(--color-primary)' : '#0F172A'}>{event.type}</Badge>
                  </div>
                  <p style={{ color: 'var(--color-text-main)', fontSize: '0.9375rem', fontWeight: '500' }}>{event.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. Projects */}
      <section id="projects" style={{ padding: '6rem 2rem', backgroundColor: 'var(--color-surface)', position: 'relative', zIndex: 1 }}>
        <Container>
          <SectionHeading title="Club Projects" subtitle="Things we build together as a community." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {mockProjects.slice(0, 3).map(project => (
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
          <SectionHeading title="Achievements" subtitle="Celebrating Our Wins" />
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {mockAchievements.slice(0, 3).map((ach, i) => (
              <div key={ach.id} style={{ display: 'flex', gap: '1.5rem', backgroundColor: 'var(--color-background)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                <div style={{ color: 'var(--color-primary)', backgroundColor: 'var(--color-surface)', padding: '1rem', borderRadius: '50%', height: 'fit-content', border: '1px solid var(--color-border)' }}>
                  <Trophy size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--color-secondary)', marginBottom: '0.25rem', fontWeight: 'bold' }}>{ach.title}</h3>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>{ach.category} • {ach.year}</span>
                  <p style={{ color: 'var(--color-text-main)', marginTop: '0.5rem', lineHeight: '1.6', fontWeight: '500' }}>{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 7. Members / Team */}
      <section id="team" style={{ padding: '6rem 2rem', backgroundColor: 'var(--color-surface)', position: 'relative', zIndex: 1 }}>
        <Container>
          <SectionHeading title="Core Team & Leads" subtitle="The Mentors Behind The Community" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
            {mockMembers.filter(m => m.role.includes('Lead') || m.role.includes('Admin')).map(member => (
              <Card key={member.id} style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--color-background)' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-surface)', margin: '0 auto 1.5rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'var(--color-primary)', border: '1px solid var(--color-border)', fontWeight: 'bold' }}>
                  {member.name.charAt(0)}
                </div>
                <h3 style={{ fontSize: '1.125rem', color: 'var(--color-secondary)', fontWeight: 'bold' }}>{member.name}</h3>
                <p style={{ color: 'var(--color-primary)', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>{member.role}</p>
                <p style={{ color: 'var(--color-text-main)', fontSize: '0.875rem', fontWeight: '500' }}>{member.domain}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

    </div>
  );
};

export default Home;
