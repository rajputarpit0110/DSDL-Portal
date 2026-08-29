import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './TiltedTiles.css';

/**
 * TiltedTiles Component
 * A tilted grid of image columns that drift vertically as you scroll.
 * 
 * @param {Array} items - Array of items, e.g. { image, alt, member }
 * @param {number} columnsCount - Number of columns to distribute items into
 * @param {number} perspective - CSS perspective value for 3D depth
 * @param {number} rotateX - Degrees to rotate the grid on the X-axis
 * @param {number} rotateZ - Degrees to rotate the grid on the Z-axis
 * @param {number} driftRange - Max pixels a column can drift during scroll
 * @param {number} tileWidth - Width of each tile in pixels
 * @param {function} onTileClick - Callback when a tile is clicked
 */
const TiltedTiles = ({
  items = [],
  columnsCount = 3,
  perspective = 1200,
  rotateX = 35,
  rotateZ = -12,
  driftRange = 120,
  tileWidth = 260,
  onTileClick = () => {}
}) => {
  const containerRef = useRef(null);

  // Hook into page scroll relative to the container element
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Distribute items into columns
  const columns = Array.from({ length: columnsCount }, () => []);
  items.forEach((item, index) => {
    columns[index % columnsCount].push(item);
  });

  // Create transforms for each column so they move differently
  // Column 1 drifts down, Column 2 drifts up, Column 3 drifts down faster
  const yColumn0 = useTransform(scrollYProgress, [0, 1], [-driftRange * 0.5, driftRange * 0.5]);
  const yColumn1 = useTransform(scrollYProgress, [0, 1], [driftRange * 0.5, -driftRange * 0.5]);
  const yColumn2 = useTransform(scrollYProgress, [0, 1], [-driftRange * 0.8, driftRange * 0.8]);

  const getColumnY = (index) => {
    switch (index % 3) {
      case 0: return yColumn0;
      case 1: return yColumn1;
      case 2: return yColumn2;
      default: return 0;
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="tilted-tiles-container" ref={containerRef}>
      <div 
        className="tilted-tiles-perspective"
        style={{ perspective }}
      >
        <motion.div 
          className="tilted-tiles-grid"
          style={{
            rotateX,
            rotateZ,
            transformStyle: 'preserve-3d'
          }}
        >
          {columns.map((columnItems, colIdx) => (
            <motion.div 
              key={colIdx}
              className="tilted-tiles-column"
              style={{
                y: getColumnY(colIdx),
                // Offset columns vertically initially so they aren't perfectly aligned
                marginTop: colIdx === 1 ? '40px' : '0px',
                transformStyle: 'preserve-3d'
              }}
            >
              {columnItems.map((item, itemIdx) => (
                <motion.div
                  key={item.id || item.image || itemIdx}
                  className="tilted-tiles-card"
                  style={{
                    width: tileWidth,
                    transformStyle: 'preserve-3d'
                  }}
                  whileHover={{ 
                    scale: 1.04,
                    z: 35,
                    transition: { duration: 0.25, ease: 'easeOut' }
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onTileClick(item)}
                >
                  <img src={item.image} alt={item.alt || 'Tile Image'} />
                  <div className="tilted-tiles-card-overlay" />
                </motion.div>
              ))}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TiltedTiles;
