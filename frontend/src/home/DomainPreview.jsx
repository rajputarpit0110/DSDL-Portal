import React from 'react';
import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';
import AccordionGallery from '../components/common/AccordionGallery';

const OFFICIAL_DOMAINS = [
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
];

const DomainPreview = ({ domains }) => {
  // Map backend domains if matching the 5 official domains, otherwise use OFFICIAL_DOMAINS
  const items = OFFICIAL_DOMAINS.map(official => {
    if (domains && domains.length > 0) {
      const match = domains.find(d => {
        const nameOrSlug = (d.slug || d.name || '').toLowerCase();
        if (official.label === 'Machine Learning' && (nameOrSlug.includes('machine') || nameOrSlug === 'ml')) return true;
        if (official.label === 'Deep Learning' && (nameOrSlug.includes('deep') || nameOrSlug === 'dl')) return true;
        if (official.label === 'Android Development' && (nameOrSlug.includes('android') || nameOrSlug.includes('app') || nameOrSlug.includes('mobile'))) return true;
        if (official.label === 'Web Development' && (nameOrSlug.includes('web') || nameOrSlug.includes('fullstack'))) return true;
        if (official.label === 'DSA' && (nameOrSlug.includes('dsa') || nameOrSlug.includes('algo') || nameOrSlug.includes('data structure'))) return true;
        return false;
      });

      if (match) {
        return {
          image: match.image || official.image,
          label: official.label,
          link: `/domains/${match.slug || official.link.replace('/domains/', '')}`,
          alt: official.alt
        };
      }
    }
    return official;
  });

  return (
    <section style={{ backgroundColor: 'var(--color-surface)', padding: '5rem 2rem' }}>
      <Container style={{ textAlign: 'center' }}>
        <SectionHeading badge='TECHNICAL DOMAINS' title='Areas You Can Explore Through KRIVA' subtitle='Discover technologies that align with your interests during recruitment and active club workshops.' />
        <div style={{ marginTop: '2.5rem', width: '100%' }}>
          <AccordionGallery
            items={items}
            defaultIndex={2}
            expandRatio={0.52}
            trigger="hover"
            height={460}
            accentColor="#3b82f6"
            overlayColor="#0a0303"
            radius={16}
          />
        </div>
      </Container>
    </section>
  );
};

export default DomainPreview;
