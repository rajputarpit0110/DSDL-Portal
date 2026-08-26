import React from 'react';
import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';
import AccordionGallery from '../components/common/AccordionGallery';

const defaultDomainItems = [
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
];

const DomainPreview = ({ domains }) => {
  const items = domains && domains.length > 0
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
    : defaultDomainItems;

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
            accentColor="var(--color-primary, #dc2626)"
            overlayColor="#0a0303"
            radius={16}
          />
        </div>
      </Container>
    </section>
  );
};

export default DomainPreview;

