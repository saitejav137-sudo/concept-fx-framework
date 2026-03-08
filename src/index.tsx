// Pro FX Framework Demo - Showcasing professional-grade effects

import { registerRoot, Composition, useCurrentFrame, AbsoluteFill } from "remotion";
import { eases, bezier, spring } from "./engine/Easing";
import { vec, cubicBezier, lerp } from "./engine/Vector2D";
import { palettes, rgb, rgbToHex, luts } from "./engine/Color";
import { presets as postEffects } from "./postproc/Effects";

const COLORS = {
  background: rgb(3, 3, 8),
  primary: rgb(0, 170, 255),
  secondary: rgb(255, 102, 0),
  accent: rgb(255, 170, 0),
  text: rgb(255, 255, 255),
  muted: rgb(136, 136, 153),
};

const smoothstep = (t: number) => t * t * (3 - 2 * t);

// ============ SCENE 1: TITLE ============
const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = smoothstep(Math.min(1, frame / 60));
  
  // Professional easing with bezier
  const scale = bezier.easeOut(frame / 60);
  const opacity = smoothstep(Math.min(1, (frame - 30) / 30));
  
  // Spring animation for subtitle
  const springVal = spring(200, 15)(Math.min(1, frame / 90));
  
  // Vector-based position
  const titlePos = lerp(vec(-50, 35), vec(50, 35), bezier.easeOut(Math.min(1, frame / 50)));
  
  // Particles with physics
  const particles = [];
  for (let i = 0; i < 50; i++) {
    const angle = (i / 50) * Math.PI * 2 + frame * 0.01;
    const radius = 10 + Math.sin(frame * 0.02 + i) * 5;
    const x = 50 + Math.cos(angle) * radius;
    const y = 50 + Math.sin(angle) * radius * 0.5;
    const twinkle = bezier.elastic((frame * 0.03 + i * 0.2) % 1);
    
    particles.push(
      <div key={i} style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: 2 + (i % 3),
        height: 2 + (i % 3),
        borderRadius: "50%",
        backgroundColor: i % 2 === 0 ? rgbToHex(COLORS.primary) : rgbToHex(COLORS.accent),
        opacity: twinkle * 0.7,
        boxShadow: `0 0 ${(2 + i % 3) * 4 * twinkle}px ${i % 2 === 0 ? rgbToHex(COLORS.primary) : rgbToHex(COLORS.accent)}`,
      }} />
    );
  }

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at 30% 30%, ${rgbToHex(rgb(26, 10, 38))} 0%, ${rgbToHex(COLORS.background)} 60%)`,
    }}>
      {particles}
      
      <div style={{
        position: "absolute",
        top: "30%",
        left: "50%",
        transform: `translate(-50%, -50%) scale(${0.7 + scale * 0.3})`,
        textAlign: "center",
      }}>
        <div style={{
          color: rgbToHex(COLORS.secondary),
          fontSize: 48,
          fontWeight: 900,
          letterSpacing: "10px",
          textShadow: `0 0 60px ${rgbToHex(COLORS.secondary)}`,
          opacity,
        }}>
          PRO FX
        </div>
        <div style={{
          color: rgbToHex(COLORS.primary),
          fontSize: 56,
          fontWeight: 900,
          letterSpacing: "12px",
          textShadow: `0 0 70px ${rgbToHex(COLORS.primary)}`,
          marginTop: -8,
          opacity,
        }}>
          FRAMEWORK
        </div>
      </div>
      
      <div style={{
        position: "absolute",
        top: "55%",
        left: "50%",
        transform: `translate(-50%, -50%) scale(${springVal * 0.3})`,
        color: rgbToHex(COLORS.muted),
        fontSize: 18,
        opacity: progress,
      }}>
        Professional-Grade Motion Graphics
      </div>
    </AbsoluteFill>
  );
};

// ============ SCENE 2: EASING SHOWCASE ============
const EasingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const localFrame = frame - 90;
  const progress = smoothstep(Math.min(1, localFrame / 40));
  
  const easings = [
    { name: "Linear", fn: eases.in },
    { name: "Ease Out", fn: eases.out },
    { name: "Elastic", fn: eases.elastic },
    { name: "Bounce", fn: eases.bounce },
    { name: "Spring", fn: eases.spring },
  ];

  return (
    <AbsoluteFill style={{ background: rgbToHex(COLORS.background) }}>
      <div style={{
        position: "absolute",
        top: "5%",
        left: "50%",
        transform: "translateX(-50%)",
        color: rgbToHex(COLORS.secondary),
        fontSize: 32,
        fontWeight: "bold",
        textShadow: `0 0 20px ${rgbToHex(COLORS.secondary)}`,
        opacity: progress,
      }}>
        PROFESSIONAL EASING
      </div>
      
      {easings.map((ease, i) => {
        const barProgress = ease.fn(Math.min(1, Math.max(0, (localFrame - i * 30) / 40));
        
        return (
          <div key={ease.name} style={{
            position: "absolute",
            top: `${18 + i * 16}%`,
            left: "10%",
            right: "10%",
            opacity: progress * (0.6 + i * 0.1),
          }}>
            <div style={{ color: rgbToHex(COLORS.muted), fontSize: 12, marginBottom: 4 }}>
              {ease.name}
            </div>
            <div style={{ height: 8, backgroundColor: "#111", borderRadius: 4, overflow: "hidden" }}>
              <div style={{
                width: `${barProgress * 100}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${rgbToHex(COLORS.primary)}, ${rgbToHex(COLORS.secondary)})`,
                borderRadius: 4,
                boxShadow: `0 0 10px ${rgbToHex(COLORS.primary)}`,
              }} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ============ SCENE 3: PARTICLES ============
const ParticleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const localFrame = frame - 180;
  const progress = smoothstep(Math.min(1, localFrame / 40));
  
  // Physics-based particles
  const particles = [];
  const count = 60;
  
  for (let i = 0; i < count; i++) {
    // Complex bezier path
    const t = (localFrame * 0.01 + i / count) % 1;
    const p0 = vec(20, 50);
    const p1 = vec(35 + Math.sin(i) * 15, 30 + Math.cos(i * 2) * 20);
    const p2 = vec(65 + Math.sin(i * 2) * 15, 70 + Math.cos(i) * 20);
    const p3 = vec(80, 50);
    
    const pos = cubicBezier(p0, p1, p2, p3, t);
    
    // Pulsing with elastic
    const pulse = bezier.elastic((localFrame * 0.05 + i) % 1);
    const size = 2 + pulse * 3;
    const color = i % 2 === 0 ? COLORS.primary : COLORS.accent;
    
    particles.push(
      <div key={i} style={{
        position: "absolute",
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: rgbToHex(color),
        opacity: 0.3 + pulse * 0.7,
        boxShadow: `0 0 ${size * 3 * pulse}px ${rgbToHex(color)}`,
      }} />
    );
  }

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at center, ${rgbToHex(rgb(10, 5, 20))} 0%, ${rgbToHex(COLORS.background)} 80%)`,
    }}>
      {particles}
      
      <div style={{
        position: "absolute",
        top: "5%",
        left: "50%",
        transform: "translateX(-50%)",
        color: rgbToHex(COLORS.secondary),
        fontSize: 32,
        fontWeight: "bold",
        textShadow: `0 0 20px ${rgbToHex(COLORS.secondary)}`,
        opacity: progress,
      }}>
        BEZIER PATHS + PHYSICS
      </div>
      
      <div style={{
        position: "absolute",
        top: "80%",
        left: "50%",
        transform: "translateX(-50%)",
        color: rgbToHex(COLORS.muted),
        fontSize: 14,
        opacity: progress,
      }}>
        Cubic bezier interpolation for smooth curves
      </div>
    </AbsoluteFill>
  );
};

// ============ SCENE 4: COLOR GRADING ============
const ColorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const localFrame = frame - 270;
  const progress = smoothstep(Math.min(1, localFrame / 40));
  
  // Color palette showcase
  const colorBars = [
    { name: "Primary", color: COLORS.primary },
    { name: "Secondary", color: COLORS.secondary },
    { name: "Accent", color: COLORS.accent },
    { name: "Text", color: COLORS.text },
  ];

  return (
    <AbsoluteFill style={{ background: rgbToHex(COLORS.background) }}>
      <div style={{
        position: "absolute",
        top: "5%",
        left: "50%",
        transform: "translateX(-50%)",
        color: rgbToHex(COLORS.success || rgb(0, 255, 136)),
        fontSize: 32,
        fontWeight: "bold",
        textShadow: `0 0 20px ${rgbToHex(rgb(0, 255, 136))}`,
        opacity: progress,
      }}>
        COLOR SYSTEM
      </div>
      
      <div style={{
        position: "absolute",
        top: "20%",
        left: "20%",
        right: "20%",
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 20,
        opacity: progress,
      }}>
        {colorBars.map((bar, i) => (
          <div key={bar.name} style={{
            height: 80,
            backgroundColor: rgbToHex(bar.color),
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 30px ${rgbToHex(bar.color)}`,
          }}>
            <span style={{ color: "#000", fontWeight: "bold" }}>{bar.name}</span>
          </div>
        ))}
      </div>
      
      <div style={{
        position: "absolute",
        top: "75%",
        left: "50%",
        transform: "translateX(-50%)",
        color: rgbToHex(COLORS.muted),
        fontSize: 14,
        opacity: progress,
        textAlign: "center",
      }}>
        RGB • HSL • LAB color spaces<br/>
        LUTs • Gradients • Palettes
      </div>
    </AbsoluteFill>
  );
};

// ============ SCENE 5: CONCLUSION ============
const ConclusionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const localFrame = frame - 360;
  const progress = smoothstep(Math.min(1, localFrame / 50));
  const scale = 0.8 + progress * 0.2;
  
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at center, ${rgbToHex(rgb(26, 10, 38))} 0%, ${rgbToHex(COLORS.background)} 70%)`,
    }}>
      <div style={{
        position: "absolute",
        top: "35%",
        left: "50%",
        transform: `translate(-50%, -50%) scale(${scale})`,
        textAlign: "center",
        opacity: progress,
      }}>
        <div style={{
          color: rgbToHex(COLORS.secondary),
          fontSize: 44,
          fontWeight: 900,
          letterSpacing: "6px",
          textShadow: `0 0 40px ${rgbToHex(COLORS.secondary)}`,
        }}>
          COMING SOON
        </div>
        <div style={{
          color: rgbToHex(COLORS.primary),
          fontSize: 28,
          fontWeight: "bold",
          marginTop: 20,
        }}>
          Professional Video Engine
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ MAIN ============
const Main: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Scene timing
  const showScene1 = frame < 90;
  const showScene2 = frame >= 90 && frame < 180;
  const showScene3 = frame >= 180 && frame < 270;
  const showScene4 = frame >= 270 && frame < 360;
  const showScene5 = frame >= 360;
  
  const fade = (inF: number, outF: number) => ({
    fadeIn: smoothstep(Math.min(1, (frame - inF + 10) / 10)),
    fadeOut: smoothstep(Math.min(1, (outF - frame + 10) / 10)),
  });

  return (
    <AbsoluteFill style={{ background: rgbToHex(COLORS.background) }}>
      {showScene1 && (
        <div style={{ opacity: fade(0, 90).fadeIn * fade(80, 90).fadeOut }}>
          <TitleScene />
        </div>
      )}
      {showScene2 && (
        <div style={{ opacity: fade(90, 180).fadeIn * fade(170, 180).fadeOut }}>
          <EasingScene />
        </div>
      )}
      {showScene3 && (
        <div style={{ opacity: fade(180, 270).fadeIn * fade(260, 270).fadeOut }}>
          <ParticleScene />
        </div>
      )}
      {showScene4 && (
        <div style={{ opacity: fade(270, 360).fadeIn * fade(350, 360).fadeOut }}>
          <ColorScene />
        </div>
      )}
      {showScene5 && (
        <div style={{ opacity: fade(360, 450).fadeIn }}>
          <ConclusionScene />
        </div>
      )}
    </AbsoluteFill>
  );
};

registerRoot(() => (
  <>
    <Composition id="Main" component={Main} durationInFrames={540} fps={30} width={1080} height={1920} />
  </>
));

export default Main;
