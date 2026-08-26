import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../../common/Container';
import Button from '../../common/Button';
import { Compass, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <Container style={{ padding: '6rem 1.5rem', textAlign: 'center', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '24px',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <Compass size={40} color="var(--color-primary)" />
      </div>

      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem', color: 'var(--color-secondary)' }}>
        404 - Page Not Found
      </h1>
      
      <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
        The page you are looking for doesn't exist or may have been moved. Let's get you back on track!
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/">
          <Button variant="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}>
            <Home size={18} /> Return to Home
          </Button>
        </Link>
        <button 
          onClick={() => window.history.back()} 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-secondary)',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={18} /> Go Back
        </button>
      </div>
    </Container>
  );
};

export default NotFound;
