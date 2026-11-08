import { useEffect, useRef, useState, useCallback } from 'react';

const PI = Math.PI;
const TWO_PI = Math.PI * 2;

/**
 * FullScreenBlochSphere
 * High-performance full-screen 3D interactive Bloch sphere canvas.
 * - Drag screen to rotate 3D view with momentum physics
 * - Click anywhere on the sphere surface to instantly set the quantum state vector
 * - Drag the vector tip directly to smoothly steer the state
 * - Mouse wheel zooms in/out
 * - Auto-rotate and view reset controls
 * - 3D depth sorting, angle arcs for theta and phi, and quantum ambient particles
 */
export default function FullScreenBlochSphere({
  th = PI / 2,
  ph = 0,
  onStateChange = () => {},
  autoRotateDefault = false
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Camera settings: azimuth (yaw), elevation (pitch), zoom scale
  const cameraRef = useRef({
    azimuth: 0.65,
    elevation: 0.32,
    zoom: 1.0,
    vx: 0,
    vy: 0,
    isDragging: false,
    dragMode: 'camera', // 'camera' or 'vector'
    startX: 0,
    startY: 0,
    startTime: 0,
    lastX: 0,
    lastY: 0,
    lastInteractionTime: Date.now()
  });

  const [autoRotate, setAutoRotate] = useState(autoRotateDefault);
  const autoRotateRef = useRef(autoRotateDefault);
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  // Current state angles ref to avoid re-binding loop
  const stateRef = useRef({ th, ph });
  useEffect(() => {
    stateRef.current = { th, ph };
  }, [th, ph]);

  // Particles floating around the sphere in 3D
  const particlesRef = useRef(
    Array.from({ length: 65 }, () => ({
      x: (Math.random() - 0.5) * 2.8,
      y: (Math.random() - 0.5) * 2.8,
      z: (Math.random() - 0.5) * 2.8,
      sz: 1 + Math.random() * 2,
      speed: 0.0006 + Math.random() * 0.0012,
      alpha: 0.2 + Math.random() * 0.5
    }))
  );

  // Hover indicator
  const hoverRef = useRef({
    x: -9999,
    y: -9999,
    onSphere: false,
    onTip: false,
    surfaceAngles: null
  });

  // 3D projection helper
  const project3D = useCallback((x, y, z, cx, cy, R, azimuth, elevation) => {
    // 1. Rotate around vertical axis (Z-axis yaw)
    const cosA = Math.cos(azimuth);
    const sinA = Math.sin(azimuth);
    const x1 = x * cosA - y * sinA;
    const y1 = x * sinA + y * cosA;
    const z1 = z;

    // 2. Pitch tilt (elevation)
    const cosE = Math.cos(elevation);
    const sinE = Math.sin(elevation);
    const X = x1;
    const Y = y1 * sinE + z1 * cosE;
    const Z = y1 * cosE - z1 * sinE; // Depth toward camera (Z > 0 is front)

    return {
      px: cx + R * X,
      py: cy - R * Y,
      depth: Z,
      X,
      Y,
      Z
    };
  }, []);

  // Ray-cast from screen coordinates back to sphere surface (theta, phi)
  const screenToSphereAngles = useCallback((mx, my, cx, cy, R, azimuth, elevation) => {
    const dx = (mx - cx) / R;
    const dy = (cy - my) / R;
    const r2 = dx * dx + dy * dy;

    if (r2 > 1.05) return null; // Outside sphere bounds

    // Assume front hemisphere facing camera (Z > 0)
    const dz = Math.sqrt(Math.max(0, 1 - Math.min(1, r2)));
    const X = dx;
    const Y = dy;
    const Z = dz;

    // Inverse elevation (pitch)
    const cosE = Math.cos(elevation);
    const sinE = Math.sin(elevation);
    const y1 = Y * sinE + Z * cosE;
    const z1 = Y * cosE - Z * sinE;
    const x1 = X;

    // Inverse azimuth (yaw)
    const cosA = Math.cos(azimuth);
    const sinA = Math.sin(azimuth);
    const x = x1 * cosA + y1 * sinA;
    const y = -x1 * sinA + y1 * cosA;
    const z = z1;

    // Normalize and compute spherical coordinates
    const norm = Math.hypot(x, y, z) || 1;
    const nx = x / norm;
    const ny = y / norm;
    const nz = Math.max(-1, Math.min(1, z / norm));

    const newTh = Math.acos(nz);
    let newPh = Math.atan2(ny, nx);
    if (newPh < 0) newPh += TWO_PI;

    return { th: newTh, ph: newPh };
  }, []);

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;
    let animId = null;

    const render = () => {
      if (!isRunning) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const time = performance.now() * 0.001;
      const cam = cameraRef.current;

      // Handle inertia and auto-rotation
      if (!cam.isDragging) {
        cam.azimuth += cam.vx;
        cam.elevation = Math.max(-1.4, Math.min(1.4, cam.elevation + cam.vy));
        cam.vx *= 0.92;
        cam.vy *= 0.92;

        // Auto-spin if enabled or when idle
        const idleDuration = (Date.now() - cam.lastInteractionTime) * 0.001;
        if (autoRotateRef.current || idleDuration > 4) {
          cam.azimuth += 0.0018;
        }
      }

      // Responsive sphere center and radius
      const baseR = Math.min(width * 0.44, height * 0.44, 450);
      const R = baseR * cam.zoom;
      const cx = width * 0.5;
      const cy = height * 0.5;

      const az = cam.azimuth;
      const el = cam.elevation;

      // 1. Ambient holographic background glow behind sphere
      const bgGrad = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.4);
      bgGrad.addColorStop(0, 'rgba(101, 213, 208, 0.09)');
      bgGrad.addColorStop(0.5, 'rgba(169, 154, 255, 0.04)');
      bgGrad.addColorStop(1, 'rgba(11, 14, 20, 0)');
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.4, 0, TWO_PI);
      ctx.fill();

      // 2. Cosmic 3D particle dust drifting in space
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.z += p.speed;
        if (p.z > 1.4) p.z = -1.4;

        const pr = project3D(p.x, p.y, p.z, cx, cy, R, az, el);
        const pAlpha = Math.max(0.05, Math.min(0.6, (pr.depth + 1.2) * 0.25 * p.alpha));
        ctx.fillStyle = `rgba(169, 154, 255, ${pAlpha})`;
        ctx.beginPath();
        ctx.arc(pr.px, pr.py, p.sz, 0, TWO_PI);
        ctx.fill();
      }

      // 3. Translucent 3D sphere volume
      const sphereGrad = ctx.createRadialGradient(
        cx - R * 0.35,
        cy - R * 0.35,
        R * 0.1,
        cx,
        cy,
        R
      );
      sphereGrad.addColorStop(0, 'rgba(24, 33, 49, 0.88)');
      sphereGrad.addColorStop(0.7, 'rgba(17, 23, 34, 0.75)');
      sphereGrad.addColorStop(1, 'rgba(11, 14, 20, 0.92)');
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, TWO_PI);
      ctx.fill();

      // Outer boundary ring
      ctx.strokeStyle = 'rgba(40, 51, 68, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, TWO_PI);
      ctx.stroke();

      // 4. Parallels (latitude rings) with depth sorting
      const drawRing = (f, segments = 64, isEquator = false) => {
        const pts = [];
        for (let i = 0; i <= segments; i++) {
          const t = (i / segments) * TWO_PI;
          const [rx, ry, rz] = f(t);
          pts.push(project3D(rx, ry, rz, cx, cy, R, az, el));
        }

        for (let i = 0; i < pts.length - 1; i++) {
          const p1 = pts[i];
          const p2 = pts[i + 1];
          const avgDepth = (p1.depth + p2.depth) / 2;

          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);

          if (isEquator) {
            if (avgDepth > 0) {
              ctx.strokeStyle = 'rgba(101, 213, 208, 0.75)';
              ctx.lineWidth = 2.0;
            } else {
              ctx.strokeStyle = 'rgba(101, 213, 208, 0.22)';
              ctx.lineWidth = 1.0;
            }
          } else {
            if (avgDepth > 0) {
              ctx.strokeStyle = 'rgba(40, 51, 68, 0.75)';
              ctx.lineWidth = 1.0;
            } else {
              ctx.strokeStyle = 'rgba(40, 51, 68, 0.22)';
              ctx.lineWidth = 0.8;
            }
          }
          ctx.stroke();
        }
      };

      // Latitude parallels: -60°, -30°, 30°, 60°
      [-PI / 3, -PI / 6, PI / 6, PI / 3].forEach((lat) => {
        const cosL = Math.cos(lat);
        const sinL = Math.sin(lat);
        drawRing((t) => [cosL * Math.cos(t), cosL * Math.sin(t), sinL]);
      });

      // Equator (lat = 0)
      drawRing((t) => [Math.cos(t), Math.sin(t), 0], 80, true);

      // Longitude meridians (at 0, 45, 90, 135 deg)
      [0, PI / 4, PI / 2, (3 * PI) / 4].forEach((lon) => {
        const cosLon = Math.cos(lon);
        const sinLon = Math.sin(lon);
        drawRing((t) => [cosLon * Math.cos(t), sinLon * Math.cos(t), Math.sin(t)], 64);
      });

      // 5. 3D Coordinate Axes with arrow tips
      const drawAxis = (p1, p2, label, poleTag = null) => {
        const a = project3D(...p1, cx, cy, R, az, el);
        const b = project3D(...p2, cx, cy, R, az, el);

        ctx.beginPath();
        ctx.moveTo(a.px, a.py);
        ctx.lineTo(b.px, b.py);
        ctx.strokeStyle = b.depth > 0 ? 'rgba(85, 185, 149, 0.65)' : 'rgba(40, 51, 68, 0.45)';
        ctx.lineWidth = 1.3;
        ctx.stroke();

        // Arrow tip at positive axis end
        ctx.beginPath();
        ctx.arc(b.px, b.py, 2.5, 0, TWO_PI);
        ctx.fillStyle = b.depth > 0 ? '#55B995' : '#283344';
        ctx.fill();

        // Axis label
        ctx.font = '12px "JetBrains Mono", monospace';
        ctx.fillStyle = b.depth > 0 ? '#ECEEF4' : '#929CAD';
        ctx.fillText(label, b.px + 6, b.py - 4);

        if (poleTag) {
          ctx.font = 'bold 13px "JetBrains Mono", monospace';
          ctx.fillStyle = '#65D5D0';
          ctx.fillText(poleTag, b.px + 18, b.py - 4);
        }
      };

      // Z Axis (|0⟩ North pole, |1⟩ South pole)
      drawAxis([0, 0, -1.22], [0, 0, 1.22], 'Z', '|0⟩');
      const southPole = project3D(0, 0, -1.22, cx, cy, R, az, el);
      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      ctx.fillStyle = '#65D5D0';
      ctx.fillText('|1⟩', southPole.px + 6, southPole.py + 14);

      // X Axis (|+⟩ at +X, |−⟩ at -X)
      drawAxis([0, 0, 0], [1.2, 0, 0], 'X', '|+⟩');
      const xNeg = project3D(-1.2, 0, 0, cx, cy, R, az, el);
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillStyle = '#929CAD';
      ctx.fillText('|−⟩', xNeg.px - 26, xNeg.py);

      // Y Axis (|+i⟩ at +Y, |−i⟩ at -Y)
      drawAxis([0, 0, 0], [0, 1.2, 0], 'Y', '|+i⟩');
      const yNeg = project3D(0, -1.2, 0, cx, cy, R, az, el);
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillStyle = '#929CAD';
      ctx.fillText('|−i⟩', yNeg.px - 28, yNeg.py);

      // 6. Current State Vector |ψ⟩
      const { th: currentTh, ph: currentPh } = stateRef.current;
      const vx = Math.sin(currentTh) * Math.cos(currentPh);
      const vy = Math.sin(currentTh) * Math.sin(currentPh);
      const vz = Math.cos(currentTh);

      const centerProj = project3D(0, 0, 0, cx, cy, R, az, el);
      const tipProj = project3D(vx, vy, vz, cx, cy, R, az, el);
      const xyProj = project3D(vx, vy, 0, cx, cy, R, az, el);

      // Dotted projection down to equatorial XY plane
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(101, 213, 208, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(tipProj.px, tipProj.py);
      ctx.lineTo(xyProj.px, xyProj.py);
      ctx.stroke();

      // Line from center to XY projection point
      ctx.beginPath();
      ctx.moveTo(centerProj.px, centerProj.py);
      ctx.lineTo(xyProj.px, xyProj.py);
      ctx.stroke();
      ctx.setLineDash([]);

      // Theta Guide Arc (from +Z toward state vector)
      if (currentTh > 0.05) {
        ctx.beginPath();
        const arcSteps = 16;
        for (let i = 0; i <= arcSteps; i++) {
          const frac = (i / arcSteps) * currentTh;
          const ax = 0.35 * Math.sin(frac) * Math.cos(currentPh);
          const ay = 0.35 * Math.sin(frac) * Math.sin(currentPh);
          const azVal = 0.35 * Math.cos(frac);
          const p = project3D(ax, ay, azVal, cx, cy, R, az, el);
          if (i === 0) ctx.moveTo(p.px, p.py);
          else ctx.lineTo(p.px, p.py);
        }
        ctx.strokeStyle = 'rgba(169, 154, 255, 0.5)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Phi Guide Arc (in XY plane from +X to projection)
      if (currentPh > 0.05 && currentTh > 0.05) {
        ctx.beginPath();
        const phiSteps = 16;
        for (let i = 0; i <= phiSteps; i++) {
          const frac = (i / phiSteps) * currentPh;
          const ax = 0.3 * Math.cos(frac);
          const ay = 0.3 * Math.sin(frac);
          const p = project3D(ax, ay, 0, cx, cy, R, az, el);
          if (i === 0) ctx.moveTo(p.px, p.py);
          else ctx.lineTo(p.px, p.py);
        }
        ctx.strokeStyle = 'rgba(101, 213, 208, 0.5)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Glowing State Vector Ray
      // Outer glow
      ctx.beginPath();
      ctx.moveTo(centerProj.px, centerProj.py);
      ctx.lineTo(tipProj.px, tipProj.py);
      ctx.strokeStyle = 'rgba(101, 213, 208, 0.35)';
      ctx.lineWidth = 6;
      ctx.stroke();

      // Core laser
      ctx.beginPath();
      ctx.moveTo(centerProj.px, centerProj.py);
      ctx.lineTo(tipProj.px, tipProj.py);
      ctx.strokeStyle = '#65D5D0';
      ctx.lineWidth = 2.8;
      ctx.stroke();

      // Pulsing Beacon Tip
      const pulse = Math.sin(time * 4) * 2.5;
      const isTipHovered = hoverRef.current.onTip;
      const tipRadius = isTipHovered ? 9 : 6.5;

      // Outer expanding ripple
      ctx.beginPath();
      ctx.arc(tipProj.px, tipProj.py, tipRadius + 6 + pulse, 0, TWO_PI);
      ctx.strokeStyle = 'rgba(101, 213, 208, 0.38)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Glowing tip body
      ctx.beginPath();
      ctx.arc(tipProj.px, tipProj.py, tipRadius, 0, TWO_PI);
      ctx.fillStyle = '#65D5D0';
      ctx.fill();

      // White hot core
      ctx.beginPath();
      ctx.arc(tipProj.px, tipProj.py, tipRadius * 0.5, 0, TWO_PI);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      // Floating label |ψ⟩
      ctx.font = 'bold 14px "JetBrains Mono", monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('|ψ⟩', tipProj.px + 12, tipProj.py - 6);

      // Check hover near vector tip for grabbing
      const hx = hoverRef.current.x;
      const hy = hoverRef.current.y;
      const distToTip = Math.hypot(tipProj.px - hx, tipProj.py - hy);
      hoverRef.current.onTip = distToTip < 28;

      // If hovering over sphere surface (and not dragging), draw faint target reticle
      const distToCenter = Math.hypot(hx - cx, hy - cy);
      const onSphereSurface = distToCenter <= R;
      hoverRef.current.onSphere = onSphereSurface;

      if (onSphereSurface && !cam.isDragging && !hoverRef.current.onTip) {
        ctx.beginPath();
        ctx.arc(hx, hy, 5, 0, TWO_PI);
        ctx.strokeStyle = 'rgba(101, 213, 208, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(hx, hy, 1.5, 0, TWO_PI);
        ctx.fillStyle = '#65D5D0';
        ctx.fill();
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animId) cancelAnimationFrame(animId);
    };
  }, [project3D]);

  // Pointer event handlers
  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const cam = cameraRef.current;
    cam.isDragging = true;
    cam.startX = mx;
    cam.startY = my;
    cam.startTime = Date.now();
    cam.lastX = mx;
    cam.lastY = my;
    cam.vx = 0;
    cam.vy = 0;
    cam.lastInteractionTime = Date.now();

    // Check if clicked directly on state vector tip
    if (hoverRef.current.onTip) {
      cam.dragMode = 'vector';
    } else {
      cam.dragMode = 'camera';
    }

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    hoverRef.current.x = mx;
    hoverRef.current.y = my;

    const cam = cameraRef.current;
    if (!cam.isDragging) return;

    cam.lastInteractionTime = Date.now();
    const dx = mx - cam.lastX;
    const dy = my - cam.lastY;
    cam.lastX = mx;
    cam.lastY = my;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const baseR = Math.min(width * 0.44, height * 0.44, 450);
    const R = baseR * cam.zoom;
    const cx = width * 0.5;
    const cy = height * 0.5;

    if (cam.dragMode === 'vector') {
      // Dragging state vector directly
      const angles = screenToSphereAngles(
        mx,
        my,
        cx,
        cy,
        R,
        cam.azimuth,
        cam.elevation
      );
      if (angles) {
        onStateChange(angles.th, angles.ph);
      }
    } else {
      // Dragging camera to rotate 3D view
      const sensitivity = 0.007;
      cam.azimuth += dx * sensitivity;
      cam.elevation = Math.max(-1.4, Math.min(1.4, cam.elevation + dy * sensitivity));
      cam.vx = dx * sensitivity * 0.5;
      cam.vy = dy * sensitivity * 0.5;
    }
  };

  const handlePointerUp = (e) => {
    const canvas = canvasRef.current;
    const cam = cameraRef.current;
    const rect = canvas ? canvas.getBoundingClientRect() : null;

    if (rect) {
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const moveDist = Math.hypot(mx - cam.startX, my - cam.startY);
      const elapsed = Date.now() - cam.startTime;

      // Click detection: if pointer barely moved and released quickly, it's a click!
      if (moveDist < 6 && elapsed < 320) {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const baseR = Math.min(width * 0.44, height * 0.44, 450);
        const R = baseR * cam.zoom;
        const cx = width * 0.5;
        const cy = height * 0.5;

        // Click anywhere on sphere surface sets statevector instantly
        const angles = screenToSphereAngles(
          mx,
          my,
          cx,
          cy,
          R,
          cam.azimuth,
          cam.elevation
        );
        if (angles) {
          onStateChange(angles.th, angles.ph);
        }
      }
    }

    cam.isDragging = false;
    cam.dragMode = 'camera';
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  // Mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const cam = cameraRef.current;
    cam.lastInteractionTime = Date.now();
    const zoomDelta = e.deltaY * -0.001;
    cam.zoom = Math.max(0.75, Math.min(1.35, cam.zoom + zoomDelta));
  };

  // Reset view button callback
  const handleResetView = () => {
    const cam = cameraRef.current;
    cam.azimuth = 0.65;
    cam.elevation = 0.32;
    cam.zoom = 1.0;
    cam.vx = 0;
    cam.vy = 0;
    cam.lastInteractionTime = Date.now();
  };

  return (
    <div
      ref={containerRef}
      className="fullscreen-bloch-sphere-wrap"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'auto'
      }}
      onWheel={handleWheel}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          cursor: hoverRef.current.onTip
            ? 'crosshair'
            : hoverRef.current.onSphere
            ? 'pointer'
            : cameraRef.current.isDragging
            ? 'grabbing'
            : 'grab',
          touchAction: 'none'
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
    </div>
  );
}
