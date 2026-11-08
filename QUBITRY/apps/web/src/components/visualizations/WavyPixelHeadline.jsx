import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * WavyPixelHeadline
 * Renders "A new way to explore the quantum world." as an undulating quantum wave
 * composed of discrete digital pixels that dynamically light up and glow when hovered over.
 */
export default function WavyPixelHeadline({ text = "A new way to explore the quantum world." }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const pixelsRef = useRef([]);
  const animFrameRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 160 });

  // Update canvas dimensions based on container width
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const w = Math.min(rect.width, 1400);
      // Height adapts to screen width and lines
      const h = w < 550 ? 200 : w < 950 ? 180 : 170;
      setDimensions({ width: Math.max(300, Math.floor(w)), height: h });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Rasterize text to sample pixels whenever dimensions change
  useEffect(() => {
    const { width, height } = dimensions;
    if (width <= 0 || height <= 0) return;

    // Use offscreen canvas for crisp text sampling
    const offscreen = document.createElement('canvas');
    offscreen.width = width;
    offscreen.height = height;
    const ctx = offscreen.getContext('2d');
    if (!ctx) return;

    // Determine font size based on container width (big and bold)
    const fontSize = width < 480 ? 30 : width < 768 ? 42 : width < 1100 ? 54 : 64;
    ctx.font = `700 ${fontSize}px "Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFFFF';

    // Word wrapping centered
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const testLine = `${currentLine} ${word}`;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > width - 40) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);

    // Draw lines centered both horizontally and vertically
    const lineHeight = fontSize * 1.25;
    const totalTextHeight = lines.length * lineHeight;
    const startY = Math.max(10, (height - totalTextHeight) / 2);

    lines.forEach((line, idx) => {
      ctx.fillText(line, width / 2, startY + idx * lineHeight);
    });

    // Sample pixels from rendered text
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    const sampled = [];

    // Step size between pixels: 3.5px for crisp digital density
    const step = width < 600 ? 3.2 : 3.8;

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const px = Math.floor(x);
        const py = Math.floor(y);
        const idx = (py * width + px) * 4;
        const alpha = data[idx + 3];

        if (alpha > 85) {
          sampled.push({
            baseX: px,
            baseY: py,
            x: px,
            y: py,
            vx: 0,
            vy: 0,
            alpha: alpha / 255,
            intensity: 0, // 0 = idle, 1 = fully illuminated
            targetIntensity: 0,
            // Phase offset creates traveling quantum wave along X and Y
            phase: px * 0.012 + py * 0.008,
            // Spectral tint from cyan to violet along width
            hue: 175 + (px / width) * 65
          });
        }
      }
    }

    pixelsRef.current = sampled;
  }, [dimensions, text]);

  // Main 60 FPS animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;

    const render = () => {
      if (!isRunning) return;

      const time = performance.now() * 0.001;
      const mouse = mouseRef.current;
      const pixels = pixelsRef.current;
      const hoverRadius = 90;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Separate lit pixels from idle pixels for optimal batch rendering
      const litPixels = [];

      // Update physics and wave motion
      for (let i = 0; i < pixels.length; i++) {
        const p = pixels[i];

        // "Kinda wavy" quantum wave function: composite sinusoidal oscillation
        const waveY = Math.sin(p.phase - time * 2.4) * 5.0 + Math.sin(p.baseX * 0.025 + time * 1.6) * 2.0;
        const waveX = Math.cos(p.phase * 0.8 + time * 1.2) * 1.5;

        // Hover distance check
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < hoverRadius) {
            // Pixels light up smoothly with distance falloff
            const excitation = Math.pow(1 - dist / hoverRadius, 1.4);
            if (excitation > p.targetIntensity) {
              p.targetIntensity = excitation;
            }

            // Subtle elastic quantum excitation push away from pointer
            const push = (1 - dist / hoverRadius) * 3.5;
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * push * 0.15;
            p.vy += Math.sin(angle) * push * 0.15;
          }
        }

        // Intensity smoothly reaches target and decays with phosphor persistence
        p.intensity += (p.targetIntensity - p.intensity) * 0.25;
        p.targetIntensity *= 0.94; // Glowing decay trail

        // Spring back to wavy target position
        const targetX = p.baseX + waveX;
        const targetY = p.baseY + waveY;
        p.x += (targetX - p.x) * 0.16 + p.vx;
        p.y += (targetY - p.y) * 0.16 + p.vy;
        p.vx *= 0.82;
        p.vy *= 0.82;

        if (p.intensity > 0.05) {
          litPixels.push(p);
        } else {
          // Render idle pixel: clean, soft luminescent state
          const sz = 2.2 * p.alpha;
          ctx.fillStyle = `rgba(225, 232, 245, ${0.68 * p.alpha})`;
          ctx.fillRect(p.x - sz / 2, p.y - sz / 2, sz, sz);
        }
      }

      // Render illuminated pixels with neon glow and expanded size
      if (litPixels.length > 0) {
        for (let i = 0; i < litPixels.length; i++) {
          const p = litPixels[i];
          const int = Math.min(1, p.intensity);
          const sz = (2.2 + int * 2.4) * p.alpha;

          // Radial glow for strongly energized pixels
          if (int > 0.35) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, sz * 2.2, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 95%, 68%, ${int * 0.35})`;
            ctx.fill();
          }

          // Core lit pixel: blends from cyan/violet to pure energized white
          const lightness = 65 + int * 32; // up to 97% (brilliant white)
          ctx.fillStyle = `hsla(${p.hue}, 90%, ${lightness}%, ${Math.min(1, 0.75 + int * 0.25)})`;
          ctx.fillRect(p.x - sz / 2, p.y - sz / 2, sz, sz);
        }
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [dimensions]);

  // Pointer event handlers
  const handlePointerMove = useCallback((e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true
    };
  }, []);

  const handlePointerLeave = useCallback(() => {
    mouseRef.current.active = false;
  }, []);

  return (
    <div
      ref={containerRef}
      className="wavy-pixel-headline-container"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 1400,
        margin: '0 auto',
        userSelect: 'none',
        pointerEvents: 'auto',
        display: 'flex',
        justifyContent: 'center'
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* Accessible text for screen readers */}
      <h1
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0
        }}
      >
        {text}
      </h1>

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          display: 'block',
          cursor: 'pointer',
          touchAction: 'none'
        }}
      />
    </div>
  );
}

