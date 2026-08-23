import { useEffect, useMemo, useRef, useCallback } from 'react';
import './DomeGallery.css';

const DEFAULT_IMAGES = [
  { src: '/events/event-induction.png', alt: 'DSDL Student Induction Programme' },
  { src: '/events/event-ai-bootcamp.png', alt: 'AI Bootcamp Session Day 1' },
  { src: '/events/event-speaker-sumit.png', alt: 'TFUG x DSDL Collaboration Speaker Sumit Tyagi' },
  { src: '/events/event-group-photo.png', alt: 'DSDL Club Community Group' },
  { src: '/events/event-stickers-swag.png', alt: 'DSDL Tech Vision Stickers & Swag' },
  { src: '/events/event-workshop-audience.png', alt: 'Hands-on Tech Workshop Audience' },
  { src: '/events/event-speaker-session.png', alt: 'Keynote Speaker & AI Mentorship' },
  { src: '/events/event-session.png', alt: 'Collaborative Lab Session' },
  { src: '/events/event-ai-poster.jpeg', alt: 'TensorFlow User Group Ghaziabad Collab' }
];

const DEFAULTS = {
  maxVerticalRotationDeg: 5,
  dragSensitivity: 20,
  enlargeTransitionMs: 300,
  segments: 35
};

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const wrapAngleSigned = deg => {
  const a = (((deg + 180) % 360) + 360) % 360;
  return a - 180;
};

function buildItems(pool, seg) {
  const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
  const evenYs = [-4, -2, 0, 2, 4];
  const oddYs = [-3, -1, 1, 3, 5];

  const coords = xCols.flatMap((x, c) => {
    const ys = c % 2 === 0 ? evenYs : oddYs;
    return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }));
  });

  const totalSlots = coords.length;
  if (pool.length === 0) {
    return coords.map(c => ({ ...c, src: '', alt: '' }));
  }

  const normalizedImages = pool.map(image => {
    if (typeof image === 'string') {
      return { src: image, alt: '' };
    }
    return { src: image.src || '', alt: image.alt || '' };
  });

  const usedImages = Array.from({ length: totalSlots }, (_, i) => normalizedImages[i % normalizedImages.length]);

  for (let i = 1; i < usedImages.length; i++) {
    if (usedImages[i].src === usedImages[i - 1].src) {
      for (let j = i + 1; j < usedImages.length; j++) {
        if (usedImages[j].src !== usedImages[i].src) {
          const tmp = usedImages[i];
          usedImages[i] = usedImages[j];
          usedImages[j] = tmp;
          break;
        }
      }
    }
  }

  return coords.map((c, i) => ({
    ...c,
    src: usedImages[i].src,
    alt: usedImages[i].alt
  }));
}

function computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments) {
  const unit = 360 / segments / 2;
  const rotateY = unit * (offsetX + (sizeX - 1) / 2);
  const rotateX = unit * (offsetY - (sizeY - 1) / 2);
  return { rotateX, rotateY };
}

export default function DomeGallery({
  images = DEFAULT_IMAGES,
  fit = 0.5,
  fitBasis = 'auto',
  minRadius = 600,
  maxRadius = Infinity,
  padFactor = 0.25,
  overlayBlurColor = '#0a0f1d',
  maxVerticalRotationDeg = DEFAULTS.maxVerticalRotationDeg,
  dragSensitivity = DEFAULTS.dragSensitivity,
  segments = DEFAULTS.segments,
  dragDampening = 0.6,
  openedImageWidth = '420px',
  openedImageHeight = '420px',
  imageBorderRadius = '20px',
  openedImageBorderRadius = '24px',
  grayscale = false
}) {
  const rootRef = useRef(null);
  const mainRef = useRef(null);
  const sphereRef = useRef(null);
  const viewerRef = useRef(null);
  const scrimRef = useRef(null);
  const focusedElRef = useRef(null);

  const rotationRef = useRef({ x: 0, y: 0 });
  const startRotRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0, time: 0 });
  const velocityRef = useRef({ vx: 0, vy: 0 });
  const inertiaRAF = useRef(null);

  const items = useMemo(() => buildItems(images, segments), [images, segments]);

  const applyTransform = (xDeg, yDeg) => {
    const el = sphereRef.current;
    if (el) {
      el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
    }
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(entries => {
      const cr = entries[0].contentRect;
      const w = Math.max(1, cr.width),
        h = Math.max(1, cr.height);
      const minDim = Math.min(w, h),
        maxDim = Math.max(w, h),
        aspect = w / h;
      let basis;
      switch (fitBasis) {
        case 'min':
          basis = minDim;
          break;
        case 'max':
          basis = maxDim;
          break;
        case 'width':
          basis = w;
          break;
        case 'height':
          basis = h;
          break;
        default:
          basis = aspect >= 1.3 ? w : minDim;
      }
      let radius = basis * fit;
      const heightGuard = h * 1.35;
      radius = Math.min(radius, heightGuard);
      radius = clamp(radius, minRadius, maxRadius);

      const viewerPad = Math.max(8, Math.round(minDim * padFactor));
      root.style.setProperty('--radius', `${Math.round(radius)}px`);
      root.style.setProperty('--viewer-pad', `${viewerPad}px`);
      root.style.setProperty('--overlay-blur-color', overlayBlurColor);
      root.style.setProperty('--tile-radius', imageBorderRadius);
      root.style.setProperty('--enlarge-radius', openedImageBorderRadius);
      root.style.setProperty('--image-filter', grayscale ? 'grayscale(1)' : 'none');
      applyTransform(rotationRef.current.x, rotationRef.current.y);
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [
    fit,
    fitBasis,
    minRadius,
    maxRadius,
    padFactor,
    overlayBlurColor,
    grayscale,
    imageBorderRadius,
    openedImageBorderRadius
  ]);

  useEffect(() => {
    applyTransform(rotationRef.current.x, rotationRef.current.y);
  }, []);

  const stopInertia = useCallback(() => {
    if (inertiaRAF.current) {
      cancelAnimationFrame(inertiaRAF.current);
      inertiaRAF.current = null;
    }
  }, []);

  const startInertia = useCallback(
    (vx, vy) => {
      const MAX_V = 1.4;
      let vX = clamp(vx, -MAX_V, MAX_V) * 80;
      let vY = clamp(vy, -MAX_V, MAX_V) * 80;
      let frames = 0;
      const d = clamp(dragDampening ?? 0.6, 0, 1);
      const frictionMul = 0.94 + 0.055 * d;
      const stopThreshold = 0.015 - 0.01 * d;
      const maxFrames = Math.round(90 + 270 * d);
      const step = () => {
        vX *= frictionMul;
        vY *= frictionMul;
        if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) {
          inertiaRAF.current = null;
          return;
        }
        if (++frames > maxFrames) {
          inertiaRAF.current = null;
          return;
        }
        const nextX = clamp(rotationRef.current.x - vY / 200, -maxVerticalRotationDeg, maxVerticalRotationDeg);
        const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200);
        rotationRef.current = { x: nextX, y: nextY };
        applyTransform(nextX, nextY);
        inertiaRAF.current = requestAnimationFrame(step);
      };
      stopInertia();
      inertiaRAF.current = requestAnimationFrame(step);
    },
    [dragDampening, maxVerticalRotationDeg, stopInertia]
  );

  // Native drag & touch handlers (100% reliable, no hook dependency conflicts)
  const onPointerDown = e => {
    if (focusedElRef.current) return;
    stopInertia();
    draggingRef.current = true;
    movedRef.current = false;
    startRotRef.current = { ...rotationRef.current };
    startPosRef.current = { x: e.clientX, y: e.clientY };
    lastPosRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    velocityRef.current = { vx: 0, vy: 0 };
  };

  const onPointerMove = e => {
    if (!draggingRef.current || focusedElRef.current) return;
    const dx = e.clientX - startPosRef.current.x;
    const dy = e.clientY - startPosRef.current.y;

    if (!movedRef.current && dx * dx + dy * dy > 25) {
      movedRef.current = true;
    }

    const now = Date.now();
    const dt = Math.max(1, now - lastPosRef.current.time);
    const stepDx = e.clientX - lastPosRef.current.x;
    const stepDy = e.clientY - lastPosRef.current.y;

    velocityRef.current = {
      vx: (stepDx / dt) * 16,
      vy: (stepDy / dt) * 16
    };

    lastPosRef.current = { x: e.clientX, y: e.clientY, time: now };

    const nextX = clamp(
      startRotRef.current.x - dy / dragSensitivity,
      -maxVerticalRotationDeg,
      maxVerticalRotationDeg
    );
    const nextY = wrapAngleSigned(startRotRef.current.y + dx / dragSensitivity);

    rotationRef.current = { x: nextX, y: nextY };
    applyTransform(nextX, nextY);
  };

  const onPointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const { vx, vy } = velocityRef.current;
    startInertia(vx, vy);
  };

  const handleTileClick = (item, e) => {
    if (movedRef.current) return;
    const tile = e.currentTarget;
    focusedElRef.current = tile;
    rootRef.current?.setAttribute('data-enlarging', 'true');

    const viewer = viewerRef.current;
    if (!viewer) return;

    viewer.innerHTML = '';
    const imgEl = document.createElement('div');
    imgEl.className = 'dome-gallery__enlarge';
    imgEl.style.width = openedImageWidth;
    imgEl.style.height = openedImageHeight;
    imgEl.style.left = '50%';
    imgEl.style.top = '50%';
    imgEl.style.transform = 'translate(-50%, -50%) scale(0.9)';
    imgEl.style.opacity = '0';
    imgEl.innerHTML = `<img src="${item.src}" alt="${item.alt || ''}" />`;
    imgEl.onclick = closeEnlarged;
    viewer.appendChild(imgEl);

    requestAnimationFrame(() => {
      imgEl.style.transform = 'translate(-50%, -50%) scale(1)';
      imgEl.style.opacity = '1';
    });
  };

  const closeEnlarged = () => {
    focusedElRef.current = null;
    rootRef.current?.removeAttribute('data-enlarging');
    if (viewerRef.current) {
      viewerRef.current.innerHTML = '';
    }
  };

  return (
    <div ref={rootRef} className="dome-gallery">
      <div
        ref={mainRef}
        className="dome-gallery__main"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div ref={sphereRef} className="dome-gallery__sphere">
          {items.map((item, i) => {
            const { rotateX, rotateY } = computeItemBaseRotation(
              item.x,
              item.y,
              item.sizeX,
              item.sizeY,
              segments
            );
            return (
              <div
                key={i}
                className="dome-gallery__tile"
                style={{
                  transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(var(--radius))`
                }}
                onClick={e => handleTileClick(item, e)}
              >
                <div className="dome-gallery__tile-frame">
                  <img src={item.src} alt={item.alt || ''} loading="lazy" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="dome-gallery__overlay" />
      <div ref={scrimRef} className="dome-gallery__scrim" onClick={closeEnlarged} />
      <div ref={viewerRef} className="dome-gallery__viewer" />
    </div>
  );
}
