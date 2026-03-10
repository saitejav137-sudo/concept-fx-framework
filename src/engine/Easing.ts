// Professional Easing Functions v2
// Frame-rate independent, bezier-based easing

export type Easing = (t: number) => number;
export type Bezier = (t: number) => number;

// Linear
export const linear: Easing = (t) => t;

// Cubic Bezier (standard)
export const cubicBezier = (x1: number, y1: number, x2: number, y2: number): Easing => {
  // Newton-Raphson iteration for bezier solving
  const solve = (t: number): number => {
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;
    
    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;
    
    return ((ay * t + by) * t + cy) * t;
  };
  
  return (t: number): number => {
    // Binary search for t where bezier(t) = target
    let lo = 0, hi = 1;
    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2;
      if (solve(mid) < t) lo = mid;
      else hi = mid;
    }
    return solve(t);
  };
};

// Preset Bezier curves (like CSS/Snap.svg)
export const bezier = {
  // Standard easing
  ease: cubicBezier(0.25, 0.1, 0.25, 1),
  easeIn: cubicBezier(0.42, 0, 1, 1),
  easeOut: cubicBezier(0, 0, 0.58, 1),
  easeInOut: cubicBezier(0.42, 0, 0.58, 1),
  
  // Penner equations (as bezier approximations)
  easeInQuad: cubicBezier(0.55, 0.085, 0.68, 0.53),
  easeOutQuad: cubicBezier(0.25, 0.46, 0.45, 0.94),
  easeInOutQuad: cubicBezier(0.455, 0.03, 0.515, 0.955),
  
  easeInCubic: cubicBezier(0.55, 0.055, 0.675, 0.19),
  easeOutCubic: cubicBezier(0.215, 0.61, 0.355, 1),
  easeInOutCubic: cubicBezier(0.645, 0.045, 0.355, 1),
  
  easeInQuart: cubicBezier(0.895, 0.03, 0.685, 0.22),
  easeOutQuart: cubicBezier(0.165, 0.84, 0.44, 1),
  easeInOutQuart: cubicBezier(0.77, 0, 0.175, 1),
  
  easeInQuint: cubicBezier(0.755, 0.05, 0.855, 0.06),
  easeOutQuint: cubicBezier(0.23, 1, 0.32, 1),
  easeInOutQuint: cubicBezier(0.86, 0, 0.07, 1),
  
  // Sine
  easeInSine: cubicBezier(0.47, 0, 0.745, 0.715),
  easeOutSine: cubicBezier(0.39, 0.575, 0.565, 1),
  easeInOutSine: cubicBezier(0.445, 0.05, 0.55, 0.95),
  
  // Expo
  easeInExpo: cubicBezier(0.95, 0.05, 0.795, 0.035),
  easeOutExpo: cubicBezier(0.19, 1, 0.22, 1),
  easeInOutExpo: cubicBezier(1, 0, 0, 1),
  
  // Circ
  easeInCirc: cubicBezier(0.6, 0.04, 0.335, 1),
  easeOutCirc: cubicBezier(0.075, 0.82, 0.165, 1),
  easeInOutCirc: cubicBezier(0.785, 0.135, 0.15, 0.86),
  
  // Back (overshoot)
  easeInBack: cubicBezier(0.6, -0.28, 0.735, 0.045),
  easeOutBack: cubicBezier(0.175, 0.885, 0.32, 1.275),
  easeInOutBack: cubicBezier(0.68, -0.55, 0.265, 1.55),
  
  // Elastic (approximation)
  elastic: (t: number): number => {
    if (t === 0 || t === 1) return t;
    return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
  },
  
  // Bounce (approximation)
  bounce: (t: number): number => {
    if (t < 1 / 2.75) return 7.5625 * t * t;
    if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  },
  
  // Snap
  snap: cubicBezier(0.075, 0.9, 0.075, 0.9),
  
  // Smooth (smoothstep)
  smooth: cubicBezier(0.4, 0, 0.2, 1),
  
  // Smoother (smootherstep)
  smoother: cubicBezier(0.23, 1, 0.32, 1),
};

// Spring physics (more realistic)
export const spring = (
  mass: number = 1,
  stiffness: number = 100,
  damping: number = 10
): Easing => {
  const omega = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  
  return (t: number): number => {
    if (zeta < 1) {
      // Underdamped
      const omegaD = omega * Math.sqrt(1 - zeta * zeta);
      return 1 - Math.exp(-zeta * omega * t) * 
        (Math.cos(omegaD * t) + (zeta * omega / omegaD) * Math.sin(omegaD * t));
    }
    // Critically damped
    return 1 - (1 + omega * t) * Math.exp(-omega * t);
  };
};

// Velocity-based easing (for physics)
export const velocity = (v0: number = 0, a: number = 1): Easing => {
  return (t: number): number => v0 * t + 0.5 * a * t * t;
};

// Friction - simulates object gradually slowing due to surface friction
// coefficient: 0.001 (ice) to 1.0 (sandpaper), default 0.1
export const friction = (coefficient: number = 0.1): Easing => {
  return (t: number): number => {
    const frictionForce = coefficient;
    const velocity = 1 - frictionForce * t;
    return Math.max(0, 1 - (frictionForce * t * t) / 2 - velocity * (1 - t));
  };
};

// Fluid drag - simulates motion through fluid (air/water)
// dragCoefficient: 0.01 (low drag) to 1.0 (high drag)
// mass: affects how quickly object slows (heavier = less affected)
export const fluidDrag = (
  dragCoefficient: number = 0.1,
  mass: number = 1
): Easing => {
  return (t: number): number => {
    const drag = dragCoefficient / mass;
    return 1 - Math.exp(-drag * t * 10);
  };
};

// Aliases
export const eases = {
  in: bezier.easeIn,
  out: bezier.easeOut,
  inOut: bezier.easeInOut,
  smooth: bezier.smooth,
  smoother: bezier.smoother,
  snap: bezier.snap,
  elastic: bezier.elastic,
  bounce: bezier.bounce,
  spring: spring(1, 180, 12),
  springBouncy: spring(1, 200, 8),
  friction: friction(0.1),
  fluidDrag: fluidDrag(0.1, 1),
};

// Utility: Chain multiple easings
export const chain = (...eases: Easing[]): Easing => {
  const len = eases.length;
  return (t: number): number => eases[Math.min(Math.floor(t * len), len - 1)]((t * len) % 1);
};

// Utility: Mirror (ping-pong)
export const mirror = (ease: Easing): Easing => {
  return (t: number): number => t < 0.5 ? ease(2 * t) : 1 - ease(2 - 2 * t);
};

// Utility: Reverse
export const reverse = (ease: Easing): Easing => {
  return (t: number): number => ease(1 - t);
};

// Utility: Scale
export const scale = (ease: Easing, factor: number = 1): Easing => {
  return (t: number): number => ease(t * factor);
};

// Utility: Offset
export const offset = (ease: Easing, offset: number = 0): Easing => {
  return (t: number): number => ease(Math.max(0, Math.min(1, t + offset)));
};
