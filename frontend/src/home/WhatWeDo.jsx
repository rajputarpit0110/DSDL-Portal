import React from 'react';
import { Code, Rocket, Users, Sparkles } from 'lucide-react';
import Card from '../common/Card';
import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';

const WhatWeDo = () => (
  <section style={{ padding: '5rem 2rem' }}>
    <Container style={{ textAlign: 'center' }}>
      <SectionHeading badge='WHAT KRIVA OFFERS' title='Empowering Students to Become Practical Engineers' subtitle='KRIVA (Data Science & Deep Learning Club) provides first-year students with hands-on technical projects, collaborative teamwork, and real mentorship beyond classroom theory.' />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'left' }}>
        <Card style={{ padding: '2rem' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: '#e0f2fe', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#0284c7' }}><Code size={24} /></div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Learn</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', lineHeight: '1.6' }}>Improve your technical skills through structured workshops, hands-on tutorials, and peer code reviews.</p>
        </Card>
        <Card style={{ padding: '2rem' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: '#dcfce7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#16a34a' }}><Rocket size={24} /></div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Build</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', lineHeight: '1.6' }}>Work on real-world web apps, mobile apps, ML models, and open-source tools to build a strong portfolio.</p>
        </Card>
        <Card style={{ padding: '2rem' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: '#ede9fe', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#7c3aed' }}><Users size={24} /></div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Collaborate</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', lineHeight: '1.6' }}>Work with motivated peers across CSE, IT, ECE, and other branches to solve real engineering problems.</p>
        </Card>
        <Card style={{ padding: '2rem' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: '#fef3c7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#d97706' }}><Sparkles size={24} /></div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Grow</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', lineHeight: '1.6' }}>Develop leadership, problem-solving, and communication skills that prepare you for top hackathons and internships.</p>
        </Card>
      </div>
    </Container>
  </section>
);

export default WhatWeDo;
