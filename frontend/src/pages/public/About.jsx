import React from 'react';
import Container from '../../common/Container';
import SectionHeading from '../../common/SectionHeading';

const About = () => {
  return (
    <div style={{ padding: '6rem 2rem' }}>
      <Container>
        <SectionHeading title='About KRIVA' subtitle='Data Science & Deep Learning Club' />
        <div style={{ backgroundColor: 'var(--panel-solid)', padding: '3rem', borderRadius: '16px', border: '1px solid var(--color-border)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)', lineHeight: '1.8', color: 'var(--color-text-main)' }}>
          <p style={{ marginBottom: '1.5rem', fontSize: '1.05rem', color: 'var(--color-text-main)' }}>
            The Data Science & Deep Learning (KRIVA) Club at KIET Group of Institutions is a vibrant community of passionate tech enthusiasts dedicated to exploring the realms of AI, ML, Data Science, and modern Web/App Development.
          </p>
          <p style={{ marginBottom: '1.5rem', fontSize: '1.05rem', color: 'var(--color-text-muted)' }}>
            Established to bridge the gap between academic theory and practical engineering, we focus on hands-on learning. We conduct workshops, host hackathons, and build open-source projects that solve real-world problems.
          </p>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--color-text-main)', marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>Our Mission</h3>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)' }}>
            To empower students with the technical skills, collaborative mindset, and leadership qualities required to innovate and excel in the rapidly evolving technology landscape.
          </p>
        </div>
      </Container>
    </div>
  );
};

export default About;
