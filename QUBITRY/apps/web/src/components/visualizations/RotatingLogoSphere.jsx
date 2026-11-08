import { useEffect, useRef } from 'react';

/**
 * RotatingLogoSphere
 * Renders an exact interactive 3D replication of the Qubitry logo:
 * - Outer solid lavender perimeter circle
 * - Top and bottom pole nodes (|0⟩ and |1⟩)
 * - 3D dashed equatorial latitudinal ring with tilt perspective
 * - 3D dashed rotating meridian longitudinal rings driven by scroll + idle spin
 * - Iconic mathematical Dirac ket |ψ⟩ at the center
 * - Ambient quantum glow aura
 */
export default function RotatingLogoSphere({
  scrollProgress = 0,
  size = 360,
  autoRotateSpeed = 0.008,
  glowColor = 'rgba(169, 154, 255, 0.25)',
  lineColor = '#D4C7F2',
  dimLineColor = 'rgba(212, 199, 242, 0.32)'
}) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const idleAngleRef = useRef(0);
  const scrollAngleRef = useRef(0);
  const targetScrollAngleRef = useRef(0);

  // Sync scroll progress smoothly
  useEffect(() => {
    // 1 full scroll through the section rotates the sphere 720 degrees (2 full turns)
    targetScrollAngleRef.current = scrollProgress * Math.PI * 4;
  }, [scrollProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;

    const handleResize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
    };
    handleResize();

    const PI = Math.PI;
    const TWO_PI = Math.PI * 2;
    const tilt = 0.16; // ~9.2 degree tilt around X axis for 3D depth

    const render = () => {
      // Smoothly interpolate scroll angle for buttery motion
      scrollAngleRef.current += (targetScrollAngleRef.current - scrollAngleRef.current) * 0.1;
      idleAngleRef.current += autoRotateSpeed;

      const totalYaw = idleAngleRef.current + scrollAngleRef.current;

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      const cx = size / 2;
      const cy = size / 2;
      const R = size * 0.375; // Sphere radius

      // 1. Quantum Glow Aura Background
      const radialGlow = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.35);
      radialGlow.addColorStop(0, glowColor);
      radialGlow.addColorStop(0.65, 'rgba(169, 154, 255, 0.08)');
      radialGlow.addColorStop(1, 'rgba(11, 14, 20, 0)');
      ctx.fillStyle = radialGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.35, 0, TWO_PI);
      ctx.fill();

      // 3D coordinate transformation function
      // (x, y, z) -> rotated by yaw around Y, then tilt around X
      const project = (x, y, z) => {
        // Yaw rotation around Y
        const cosY = Math.cos(totalYaw);
        const sinY = Math.sin(totalYaw);
        const x1 = x * cosY + z * sinY;
        const y1 = y;
        const z1 = -x * sinY + z * cosY;

        // Pitch / tilt around X
        const cosT = Math.cos(tilt);
        const sinT = Math.sin(tilt);
        const x2 = x1;
        const y2 = y1 * cosT - z1 * sinT;
        const z2 = y1 * sinT + z1 * cosT;

        return {
          px: cx + x2,
          py: cy + y2,
          pz: z2
        };
      };

      // 2. BACK-FACE MERIDIANS & EQUATOR (dashed, dimmer for depth)
      ctx.lineWidth = 1.6;
      ctx.lineCap = 'round';

      // Draw Equator (horizontal ring)
      // The equator has coordinates (R*cos(phi), 0, R*sin(phi))
      // Back half (z2 < 0)
      ctx.strokeStyle = dimLineColor;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      const steps = 72;
      let first = true;
      for (let i = 0; i <= steps; i++) {
        const phi = (i / steps) * TWO_PI;
        // Equator doesn't depend on yaw if symmetrical, but follows tilt
        const x = R * Math.cos(phi);
        const z = R * Math.sin(phi);
        const y2 = -z * Math.sin(tilt);
        const z2 = z * Math.cos(tilt);
        if (z2 <= 0) {
          const px = cx + x;
          const py = cy + y2;
          if (first) {
            ctx.moveTo(px, py);
            first = false;
          } else {
            ctx.lineTo(px, py);
          }
        } else {
          first = true;
        }
      }
      ctx.stroke();

      // Draw Meridians (longitudes)
      // We draw 2 orthogonal meridian loops (offset by 90 deg) or 3 loops (offset by 60 deg)
      // In the logo, 1 main meridian is featured prominently. Having 2 orthogonal ones gives continuous 3D rotation!
      const meridianAngles = [0, PI / 2];

      meridianAngles.forEach(offset => {
        // Back-face segments
        ctx.strokeStyle = dimLineColor;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        let drawing = false;

        for (let i = 0; i <= steps; i++) {
          const theta = (i / steps) * TWO_PI; // angle around vertical circle
          // Circle in plane with longitude `offset`
          const x0 = R * Math.sin(theta) * Math.sin(offset);
          const y0 = -R * Math.cos(theta);
          const z0 = R * Math.sin(theta) * Math.cos(offset);

          const pt = project(x0, y0, z0);
          if (pt.pz <= 0) {
            if (!drawing) {
              ctx.moveTo(pt.px, pt.py);
              drawing = true;
            } else {
              ctx.lineTo(pt.px, pt.py);
            }
          } else {
            drawing = false;
          }
        }
        ctx.stroke();
      });

      // 3. FRONT-FACE MERIDIANS & EQUATOR (bright dashed lavender)
      meridianAngles.forEach(offset => {
        ctx.strokeStyle = lineColor;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        let drawing = false;

        for (let i = 0; i <= steps; i++) {
          const theta = (i / steps) * TWO_PI;
          const x0 = R * Math.sin(theta) * Math.sin(offset);
          const y0 = -R * Math.cos(theta);
          const z0 = R * Math.sin(theta) * Math.cos(offset);

          const pt = project(x0, y0, z0);
          if (pt.pz > 0) {
            if (!drawing) {
              ctx.moveTo(pt.px, pt.py);
              drawing = true;
            } else {
              ctx.lineTo(pt.px, pt.py);
            }
          } else {
            drawing = false;
          }
        }
        ctx.stroke();
      });

      // Front-face Equator
      ctx.strokeStyle = lineColor;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      first = true;
      for (let i = 0; i <= steps; i++) {
        const phi = (i / steps) * TWO_PI;
        const x = R * Math.cos(phi);
        const z = R * Math.sin(phi);
        const y2 = -z * Math.sin(tilt);
        const z2 = z * Math.cos(tilt);
        if (z2 > 0) {
          const px = cx + x;
          const py = cy + y2;
          if (first) {
            ctx.moveTo(px, py);
            first = false;
          } else {
            ctx.lineTo(px, py);
          }
        } else {
          first = true;
        }
      }
      ctx.stroke();

      // 4. OUTER SOLID CIRCULAR RIM (Silhouette)
      ctx.setLineDash([]);
      ctx.lineWidth = 2.4;
      ctx.strokeStyle = lineColor;
      ctx.shadowColor = 'rgba(169, 154, 255, 0.45)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, TWO_PI);
      ctx.stroke();
      ctx.shadowBlur = 0; // reset shadow

      // 5. POLE NODES (Top and Bottom filled dots)
      // Top Pole (0, -R, 0)
      const topPole = project(0, -R, 0);
      // Bottom Pole (0, R, 0)
      const botPole = project(0, R, 0);

      ctx.fillStyle = lineColor;
      ctx.shadowColor = 'rgba(212, 199, 242, 0.8)';
      ctx.shadowBlur = 8;

      // Top dot
      ctx.beginPath();
      ctx.arc(topPole.px, topPole.py, 5.2, 0, TWO_PI);
      ctx.fill();

      // Bottom dot
      ctx.beginPath();
      ctx.arc(botPole.px, botPole.py, 5.2, 0, TWO_PI);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 6. CENTRAL DIRAC KET |ψ⟩
      ctx.font = 'italic 500 36px "Times New Roman", "Computer Modern", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ECEEF4';
      ctx.shadowColor = 'rgba(212, 199, 242, 0.55)';
      ctx.shadowBlur = 6;
      ctx.fillText('|ψ⟩', cx, cy + 1);
      ctx.shadowBlur = 0;

      ctx.restore();

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [size, autoRotateSpeed, glowColor, lineColor, dimLineColor]);

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: size,
          height: size,
          display: 'block'
        }}
      />
    </div>
  );
}

