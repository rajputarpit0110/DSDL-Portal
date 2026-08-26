import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import './ClickStack.css';

/**
 * ClickStack Component
 * A click-to-cycle (and swipe-to-cycle) animated card stack.
 * 
 * @param {Array} items - Array of card items, e.g. { image, alt, title, subtitle }
 * @param {number} cardWidth - Width of each card in pixels
 * @param {number} cardHeight - Height of each card in pixels
 * @param {number} scaleOffset - Scale difference between stacked cards
 * @param {number} yOffset - Vertical position offset between stacked cards
 * @param {number} rotationOffset - Maximum rotation deviation for a stacked deck look
 * @param {number} visibleCount - Number of cards visible in the stack at once
 */
const ClickStack = ({
  items = [],
  cardWidth = 320,
  cardHeight = 440,
  scaleOffset = 0.04,
  yOffset = -15,
  rotationOffset = 2,
  visibleCount = 3
}) => {
  const [cards, setCards] = useState(items);
  const [isAnimating, setIsAnimating] = useState(false);

  // Sync internal state if items prop changes
  useEffect(() => {
    setCards(items);
  }, [items]);

  const topCardControls = useAnimation();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0.5, 1, 1, 1, 0.5]);

  const cycleCard = async (direction = 'right') => {
    if (isAnimating || cards.length <= 1) return;
    setIsAnimating(true);

    const flyOutX = direction === 'right' ? cardWidth + 150 : -cardWidth - 150;
    const flyOutAngle = direction === 'right' ? 25 : -25;

    // 1. Animate top card flying off-screen
    await topCardControls.start({
      x: flyOutX,
      rotate: flyOutAngle,
      opacity: 0,
      transition: { duration: 0.35, ease: 'easeOut' }
    });

    // 2. Rotate cards array in state: move first item to the end
    setCards(prev => {
      const next = [...prev];
      const first = next.shift();
      if (first) next.push(first);
      return next;
    });

    // 3. Reset the motion value and animate the new top card in from the back
    x.set(0);
    
    // Set initial properties for the incoming card (which is now at the back)
    topCardControls.set({
      x: 0,
      rotate: 0,
      opacity: 1,
      scale: 1
    });

    setIsAnimating(false);
  };

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 80;
    if (info.offset.x > swipeThreshold) {
      cycleCard('right');
    } else if (info.offset.x < -swipeThreshold) {
      cycleCard('left');
    } else {
      // Snap back if threshold not met
      topCardControls.start({ x: 0, rotate: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div 
      className="click-stack-container" 
      style={{ 
        width: cardWidth, 
        height: cardHeight + Math.abs(yOffset) * (visibleCount - 1),
        paddingTop: Math.abs(yOffset) * (visibleCount - 1)
      }}
    >
      {cards
        .slice(0, visibleCount)
        .reverse() // Render bottom cards first so top card is drawn on top
        .map((card, index) => {
          // Index relative to the rendered slice (after reversing)
          // Since we reversed, index 0 is the bottom card, and index (visibleCount-1) is the top card
          const renderIndex = visibleCount - 1 - index; 
          const isTopCard = renderIndex === 0;

          // Compute stacking offsets
          const cardScale = 1 - renderIndex * scaleOffset;
          const cardY = renderIndex * yOffset;
          const cardZIndex = cards.length - renderIndex;
          
          // Slight alternating rotation for a natural "stacked papers" look
          const cardRotation = isTopCard ? 0 : (renderIndex % 2 === 0 ? rotationOffset : -rotationOffset);

          if (isTopCard) {
            return (
              <motion.div
                key={card.id || card.image}
                className="click-stack-card"
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  zIndex: cardZIndex,
                  x,
                  rotate,
                  opacity,
                  scale: 1,
                  y: 0
                }}
                animate={topCardControls}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                onClick={() => cycleCard('right')}
                whileTap={{ scale: 0.98 }}
              >
                <img src={card.image} alt={card.alt || 'Team Member'} />
              </motion.div>
            );
          }

          // Cards beneath the top card
          return (
            <motion.div
              key={card.id || card.image}
              className="click-stack-card"
              style={{
                width: cardWidth,
                height: cardHeight,
                zIndex: cardZIndex,
                y: cardY,
                scale: cardScale,
                rotate: cardRotation,
                pointerEvents: 'none' // Prevent clicking cards underneath
              }}
              layout // Smooth transition when cards slide forward
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <img src={card.image} alt={card.alt || 'Team Member'} />
            </motion.div>
          );
        })}
    </div>
  );
};

export default ClickStack;
