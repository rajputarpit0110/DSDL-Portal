import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './CardSpread.css';

/**
 * CardSpread Component
 * A fanned deck of cards that spreads open on hover.
 * 
 * @param {Array} items - Array of cards, e.g. { image, alt, member }
 * @param {number} cardWidth - Width of each card in pixels
 * @param {number} cardHeight - Height of each card in pixels
 * @param {number} xSpacingSpread - Horizontal spacing offset when fanned out
 * @param {number} xSpacingCollapse - Horizontal spacing offset when stacked
 * @param {number} rotateSpread - Rotation degrees step when fanned out
 * @param {number} rotateCollapse - Rotation degrees step when stacked
 * @param {number} yOffsetSpread - Vertical arc offset when fanned out
 * @param {number} yOffsetCollapse - Vertical arc offset when stacked
 * @param {function} onCardClick - Callback when a card is clicked
 */
const CardSpread = ({
  items = [],
  cardWidth = 280,
  cardHeight = 400,
  xSpacingSpread = 150,
  xSpacingCollapse = 15,
  rotateSpread = 10,
  rotateCollapse = 3,
  yOffsetSpread = 10,
  yOffsetCollapse = 2,
  onCardClick = () => {}
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!items || items.length === 0) return null;

  const N = items.length;
  const midIndex = (N - 1) / 2;

  return (
    <div 
      className="card-spread-container"
      style={{
        width: cardWidth + (isHovered ? xSpacingSpread * (N - 1) : xSpacingCollapse * (N - 1)),
        height: cardHeight + (isHovered ? yOffsetSpread * midIndex : yOffsetCollapse * midIndex),
        transition: 'width 0.4s cubic-bezier(0.25, 1, 0.5, 1), height 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {items.map((item, index) => {
        const relIndex = index - midIndex; // E.g., for N=5: -2, -1, 0, 1, 2
        
        // Stacking order: center card on top when collapsed, or render normally when spread
        const zIndex = isHovered ? index + 10 : Math.round(N - Math.abs(relIndex));

        // Collapse positions
        const xCollapse = relIndex * xSpacingCollapse;
        const rotateColl = relIndex * rotateCollapse;
        const yCollapse = Math.abs(relIndex) * yOffsetCollapse;

        // Spread positions
        const xSpread = relIndex * xSpacingSpread;
        const rotateSp = relIndex * rotateSpread;
        const ySpread = Math.abs(relIndex) * yOffsetSpread;

        return (
          <motion.div
            key={item.id || item.image || index}
            className="card-spread-card"
            style={{
              width: cardWidth,
              height: cardHeight,
              zIndex
            }}
            animate={{
              x: isHovered ? xSpread : xCollapse,
              y: isHovered ? ySpread : yCollapse,
              rotate: isHovered ? rotateSp : rotateColl,
              scale: isHovered ? 1 : 1 - Math.abs(relIndex) * 0.02
            }}
            transition={{
              type: 'spring',
              stiffness: 180,
              damping: 18,
              mass: 0.8
            }}
            whileHover={{ 
              scale: 1.05,
              y: (isHovered ? ySpread : yCollapse) - 15, // Lift card slightly higher on hover
              transition: { duration: 0.2, ease: 'easeOut' }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onCardClick(item)}
          >
            <img src={item.image} alt={item.alt || 'Card'} />
          </motion.div>
        );
      })}
    </div>
  );
};

export default CardSpread;
