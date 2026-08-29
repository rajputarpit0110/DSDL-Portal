import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowRight, ExternalLink } from 'lucide-react';
import './ProfileSpotlight.css';

// Custom inline SVG for Github (since brand icons are not exported in this lucide-react version)
const GithubIcon = ({ size = 18 }) => (
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

// Custom inline SVG for Linkedin
const LinkedinIcon = ({ size = 18 }) => (
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

/**
 * ProfileSpotlight Component
 * Spotlight creator card overlay on an atmospheric dark panel (inspired by React Bits Profile 5).
 * 
 * @param {Object} member - Member profile details
 * @param {boolean} isOpen - Controls visibility
 * @param {function} onClose - Closes the overlay
 */
const ProfileSpotlight = ({ member, isOpen, onClose }) => {
  if (!isOpen || !member) return null;

  // Default fallbacks for profile links and stats
  const stats = member.stats || [
    { label: 'Projects', value: '4+' },
    { label: 'Contributions', value: '60+' },
    { label: 'Level', value: 'L3' }
  ];

  const links = member.links || [
    { label: 'GitHub Repository', url: 'https://github.com', type: 'github' },
    { label: 'LinkedIn Connection', url: 'https://linkedin.com', type: 'linkedin' }
  ];

  const getLinkIcon = (type) => {
    switch (type) {
      case 'github': return <GithubIcon size={18} />;
      case 'linkedin': return <LinkedinIcon size={18} />;
      case 'mail': return <Mail size={18} />;
      default: return <ExternalLink size={18} />;
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="profile-spotlight-overlay" 
        onClick={onClose}
      >
        <motion.div 
          className="profile-spotlight-card"
          onClick={(e) => e.stopPropagation()} // Prevent closing when card itself is clicked
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, type: 'spring', damping: 25, stiffness: 250 }}
        >
          {/* Close Button */}
          <button 
            className="profile-spotlight-close-btn" 
            onClick={onClose}
            aria-label="Close spotlight modal"
          >
            <X size={20} />
          </button>

          {/* Left Column: Image */}
          <div className="profile-spotlight-image-side">
            <img src={member.image} alt={member.name} />
          </div>

          {/* Right Column: Profile Info & Stats */}
          <div className="profile-spotlight-content-side">
            <div className="profile-spotlight-header">
              <span className="profile-spotlight-badge">KRIVA Leader</span>
              <h3 className="profile-spotlight-name">{member.name}</h3>
              <p className="profile-spotlight-role">{member.role} • <span style={{ color: 'var(--color-primary, #dc2626)' }}>{member.domain}</span></p>
            </div>

            {/* Stats list */}
            <div className="profile-spotlight-stats">
              {stats.map((s, idx) => (
                <div className="profile-spotlight-stat-item" key={idx}>
                  <span className="profile-spotlight-stat-val">{s.value}</span>
                  <span className="profile-spotlight-stat-lbl">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Creator Links tabbed rows */}
            <div className="profile-spotlight-links">
              {links.map((link, idx) => (
                <a 
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profile-spotlight-link-row"
                >
                  <div className="profile-spotlight-link-left">
                    {getLinkIcon(link.type)}
                    <span>{link.label}</span>
                  </div>
                  <ArrowRight size={16} style={{ opacity: 0.6 }} />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProfileSpotlight;
