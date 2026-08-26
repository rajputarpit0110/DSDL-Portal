import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';
import Container from '../../common/Container';
import { domainDetailsData } from '../../data/domainDetailsData';
import {
  Brain,
  Sparkles,
  BarChart,
  Monitor,
  Smartphone,
  Code2,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Layers,
  MapPin,
  Rocket,
  Cpu,
  Terminal
} from 'lucide-react';

const domainThemes = {
  'machine-learning': {
    accent: '#38bdf8', // Sky Blue / Cyan
    accentBg: 'rgba(14, 165, 233, 0.15)',
    accentBorder: 'rgba(56, 189, 248, 0.35)',
    accentSolid: '#0284c7',
    badgeText: '#7dd3fc',
    buttonBg: '#0369a1',
    buttonBorder: '#38bdf8',
    buttonHover: '#0284c7',
    glow: 'rgba(14, 165, 233, 0.4)'
  },
  'deep-learning': {
    accent: '#a78bfa', // Purple / Violet
    accentBg: 'rgba(139, 92, 246, 0.15)',
    accentBorder: 'rgba(167, 139, 250, 0.35)',
    accentSolid: '#7c3aed',
    badgeText: '#c4b5fd',
    buttonBg: '#6d28d9',
    buttonBorder: '#a78bfa',
    buttonHover: '#7c3aed',
    glow: 'rgba(139, 92, 246, 0.4)'
  },
  'android-development': {
    accent: '#2dd4bf', // Teal / Mint
    accentBg: 'rgba(20, 184, 166, 0.15)',
    accentBorder: 'rgba(45, 212, 191, 0.35)',
    accentSolid: '#0d9488',
    badgeText: '#5eead4',
    buttonBg: '#0f766e',
    buttonBorder: '#2dd4bf',
    buttonHover: '#0d9488',
    glow: 'rgba(20, 184, 166, 0.4)'
  },
  'web-development': {
    accent: '#4ade80', // Green / Emerald
    accentBg: 'rgba(34, 197, 94, 0.15)',
    accentBorder: 'rgba(74, 222, 128, 0.35)',
    accentSolid: '#16a34a',
    badgeText: '#86efac',
    buttonBg: '#15803d',
    buttonBorder: '#4ade80',
    buttonHover: '#16a34a',
    glow: 'rgba(34, 197, 94, 0.4)'
  },
  'dsa': {
    accent: '#facc15', // Yellow / Amber
    accentBg: 'rgba(234, 179, 8, 0.15)',
    accentBorder: 'rgba(250, 204, 21, 0.35)',
    accentSolid: '#ca8a04',
    badgeText: '#fef08a',
    buttonBg: '#a16207',
    buttonBorder: '#facc15',
    buttonHover: '#ca8a04',
    glow: 'rgba(234, 179, 8, 0.4)'
  }
};

const DomainDetail = () => {
  const { slug } = useParams();
  const [domain, setDomain] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to resolve slug variations
  const resolveSlug = (rawSlug) => {
    if (!rawSlug) return 'machine-learning';
    const s = rawSlug.toLowerCase();
    if (s.includes('machine') || s === 'ml' || s === 'ai-ml') return 'machine-learning';
    if (s.includes('web')) return 'web-development';
    if (s.includes('dsa') || s.includes('algo')) return 'dsa';
    if (s.includes('deep')) return 'deep-learning';
    if (s.includes('android') || s.includes('app') || s.includes('mobile')) return 'android-development';
    return s;
  };

  const normalizedKey = resolveSlug(slug);
  const currentTheme = domainThemes[normalizedKey] || domainThemes['machine-learning'];

  useEffect(() => {
    const localData = domainDetailsData[normalizedKey];

    // Try fetching from backend first, fallback to comprehensive local domain dataset
    apiClient.get(`/domains/${slug}`)
      .then((apiRes) => {
        if (apiRes) {
          setDomain({
            ...localData,
            ...apiRes,
            keyTerms: apiRes.keyTerms || localData?.keyTerms || [],
            roadmap: apiRes.roadmap || localData?.roadmap || [],
            techStack: apiRes.techStack || localData?.techStack || [],
            whyJoin: apiRes.whyJoin || localData?.whyJoin || [],
            examples: apiRes.examples || localData?.examples || []
          });
        } else if (localData) {
          setDomain(localData);
        }
      })
      .catch(() => {
        if (localData) {
          setDomain(localData);
        }
      })
      .finally(() => setLoading(false));
  }, [slug, normalizedKey]);

  if (loading) {
    return (
      <div style={{ padding: '8rem 2rem', textAlign: 'center', backgroundColor: 'var(--color-background)', minHeight: '80vh' }}>
        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid var(--color-border)', borderTopColor: currentTheme.accent, borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Loading domain overview...</p>
      </div>
    );
  }

  if (!domain) {
    return (
      <div style={{ padding: '8rem 2rem', textAlign: 'center', backgroundColor: 'var(--color-background)', minHeight: '80vh' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--color-text-main)', marginBottom: '1rem' }}>Domain Not Found</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>The domain you are looking for does not exist or has been moved.</p>
        <Link
          to="/#domains"
          className="btn"
          style={{
            backgroundColor: currentTheme.buttonBg,
            border: `1px solid ${currentTheme.buttonBorder}`,
            color: '#ffffff',
            boxShadow: `0 4px 14px ${currentTheme.glow}`
          }}
        >
          <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Back to Domains
        </Link>
      </div>
    );
  }

  const getDomainIcon = (iconName) => {
    switch (iconName) {
      case 'Brain':
      case 'ai-ml':
        return <Brain size={36} />;
      case 'Sparkles':
      case 'dsa':
        return <Sparkles size={36} />;
      case 'BarChart':
      case 'data-science':
        return <BarChart size={36} />;
      case 'Monitor':
      case 'web-dev':
        return <Monitor size={36} />;
      case 'Smartphone':
      case 'app-dev':
        return <Smartphone size={36} />;
      default:
        return <Code2 size={36} />;
    }
  };

  const allDomainsList = [
    { name: 'Machine Learning', slug: 'machine-learning', theme: domainThemes['machine-learning'] },
    { name: 'Deep Learning', slug: 'deep-learning', theme: domainThemes['deep-learning'] },
    { name: 'Android Development', slug: 'android-development', theme: domainThemes['android-development'] },
    { name: 'Web Development', slug: 'web-development', theme: domainThemes['web-development'] },
    { name: 'DSA', slug: 'dsa', theme: domainThemes['dsa'] }
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', paddingBottom: '6rem', position: 'relative' }}>
      
      {/* Subtle Grid Background */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 0 }}></div>

      {/* Hero Header Section with Image Overlay */}
      <div style={{
        position: 'relative',
        backgroundColor: '#070b14',
        color: '#ffffff',
        padding: '5rem 2rem 6rem 2rem',
        overflow: 'hidden',
        zIndex: 1,
        borderBottom: '1px solid var(--color-border)'
      }}>
        {domain.coverImage && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${domain.coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.2,
            filter: 'blur(3px)',
            transform: 'scale(1.05)'
          }}></div>
        )}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(7,11,20,0.7) 0%, rgba(10,3,3,0.95) 100%)'
        }}></div>

        <Container style={{ position: 'relative', zIndex: 2 }}>
          {/* Breadcrumb Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', fontSize: '0.875rem' }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}>Home</Link>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>/</span>
            <Link to="/#domains" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Domains</Link>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>/</span>
            <span style={{ color: currentTheme.accent, fontWeight: 600 }}>{domain.name}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                backgroundColor: currentTheme.accentBg,
                color: currentTheme.accent,
                padding: '0.75rem',
                borderRadius: '14px',
                border: `1px solid ${currentTheme.accentBorder}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {getDomainIcon(domain.icon)}
              </div>
              <span style={{
                padding: '0.35rem 0.85rem',
                fontSize: '0.8125rem',
                letterSpacing: '0.05em',
                fontWeight: 700,
                borderRadius: '9999px',
                backgroundColor: currentTheme.accentBg,
                color: currentTheme.badgeText,
                border: `1px solid ${currentTheme.accentBorder}`
              }}>
                {domain.badge || 'Technical Track'}
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              {domain.name}
            </h1>

            <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, fontWeight: 400 }}>
              {domain.tagline || domain.description}
            </p>

            {/* Quick Switcher Tabs with per-domain unique theme colors */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', alignSelf: 'center', marginRight: '0.5rem' }}>Other Domains:</span>
              {allDomainsList.map((item) => {
                const isActive = item.slug === normalizedKey;
                return (
                  <Link
                    key={item.slug}
                    to={`/domains/${item.slug}`}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '8px',
                      fontSize: '0.8125rem',
                      textDecoration: 'none',
                      fontWeight: 600,
                      backgroundColor: isActive ? item.theme.buttonBg : 'rgba(255,255,255,0.06)',
                      color: isActive ? '#ffffff' : 'var(--color-text-main)',
                      transition: 'all 0.2s',
                      border: isActive ? `1px solid ${item.theme.buttonBorder}` : '1px solid rgba(255,255,255,0.1)',
                      boxShadow: isActive ? `0 2px 10px ${item.theme.glow}` : 'none'
                    }}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content Layout */}
      <Container style={{ marginTop: '-2rem', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }}>
          
          {/* 1. Overview Card */}
          <div style={{ padding: '2.5rem', backgroundColor: 'var(--panel-solid)', borderRadius: '16px', border: '1px solid var(--color-border)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <BookOpen size={24} style={{ color: currentTheme.accent }} />
              <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-main)', fontWeight: 700 }}>Domain Overview</h2>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem', lineHeight: '1.8', fontWeight: 400 }}>
              {domain.description}
            </p>

            {domain.techStack && domain.techStack.length > 0 && (
              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontWeight: 700 }}>
                  Tools & Technologies Taught
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {domain.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        color: 'var(--color-text-main)',
                        border: '1px solid var(--color-border)',
                        padding: '0.4rem 0.85rem',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <Terminal size={14} style={{ color: currentTheme.accent }} />
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Key Terms & Concepts Section */}
          <div style={{ padding: '2.5rem', backgroundColor: 'var(--panel-solid)', borderRadius: '16px', border: '1px solid var(--color-border)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Layers size={24} style={{ color: currentTheme.accent }} />
              <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-main)', fontWeight: 700 }}>Key Technical Terms & Concepts</h2>
            </div>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
              Essential nomenclature and foundational principles explained for beginners and aspiring domain specialists.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {(domain.keyTerms || []).map((item, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    transition: 'transform 0.2s, border-color 0.2s',
                    position: 'relative'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = currentTheme.accentBorder;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = 'var(--color-border)' ;
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: currentTheme.accent }}></div>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--color-text-main)', fontWeight: 700, margin: 0 }}>
                      {item.term}
                    </h3>
                  </div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.65', margin: 0, fontWeight: 400 }}>
                    {item.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Domain Learning Roadmap */}
          {domain.roadmap && domain.roadmap.length > 0 && (
            <div style={{ padding: '2.5rem', backgroundColor: 'var(--panel-solid)', borderRadius: '16px', border: '1px solid var(--color-border)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <MapPin size={24} style={{ color: currentTheme.accent }} />
                <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-main)', fontWeight: 700 }}>Curriculum & Mentorship Roadmap</h2>
              </div>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                How we take you from core fundamentals to shipping advanced production implementations.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                {domain.roadmap.map((step, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{
                      backgroundColor: currentTheme.accentBg,
                      color: currentTheme.badgeText,
                      border: `1px solid ${currentTheme.accentBorder}`,
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '6px',
                      width: 'fit-content'
                    }}>
                      {step.stage}
                    </div>
                    <p style={{ color: 'var(--color-text-main)', fontSize: '0.925rem', lineHeight: '1.6', margin: 0 }}>
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Benefits & Example Projects (2 Column Grid) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2.5rem' }}>
            
            {/* Why You Should Join */}
            <div style={{ padding: '2.5rem', backgroundColor: 'var(--panel-solid)', borderRadius: '16px', border: '1px solid var(--color-border)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Rocket size={24} style={{ color: currentTheme.accent }} />
                <h2 style={{ fontSize: '1.35rem', color: 'var(--color-text-main)', fontWeight: 700 }}>Why Join This Domain?</h2>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {(domain.whyJoin || ['Specialized Mentorship', 'Collaborative Environment']).map((reason, index) => (
                  <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', color: 'var(--color-text-main)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                    <CheckCircle2 size={20} style={{ color: currentTheme.accent, flexShrink: 0, marginTop: '0.2rem' }} />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Example Projects */}
            <div style={{ padding: '2.5rem', backgroundColor: 'var(--panel-solid)', borderRadius: '16px', border: '1px solid var(--color-border)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Cpu size={24} style={{ color: currentTheme.accent }} />
                <h2 style={{ fontSize: '1.35rem', color: 'var(--color-text-main)', fontWeight: 700 }}>Hands-on Projects Built</h2>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {(domain.examples || ['Real-World Project Showcase']).map((example, index) => (
                  <li
                    key={index}
                    style={{
                      padding: '1rem 1.25rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '10px',
                      color: 'var(--color-text-main)',
                      border: '1px solid var(--color-border)',
                      borderLeft: `4px solid ${currentTheme.accent}`,
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      lineHeight: '1.5'
                    }}
                  >
                    {example}
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Bottom Action Footer */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <Link
              to="/#domains"
              className="btn"
              style={{
                backgroundColor: currentTheme.buttonBg,
                border: `1px solid ${currentTheme.buttonBorder}`,
                color: '#ffffff',
                boxShadow: `0 4px 14px ${currentTheme.glow}`,
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = currentTheme.buttonHover}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = currentTheme.buttonBg}
            >
              <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Explore All Domains
            </Link>
          </div>

        </div>
      </Container>
    </div>
  );
};

export default DomainDetail;
