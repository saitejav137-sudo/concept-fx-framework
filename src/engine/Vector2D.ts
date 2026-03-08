// Vector2D - Professional 2D Math Library
// Precise vector operations for motion graphics

export interface Vector2D {
  x: number;
  y: number;
}

export interface BezierPoint {
  x: number;
  y: number;
  cp1x?: number;
  cp1y?: number;
  cp2x?: number;
  cp2y?: number;
}

// Factory
export const vec = (x: number, y: number): Vector2D => ({ x, y });

// Basic operations
export const add = (a: Vector2D, b: Vector2D): Vector2D => ({ x: a.x + b.x, y: a.y + b.y });
export const sub = (a: Vector2D, b: Vector2D): Vector2D => ({ x: a.x - b.x, y: a.y - b.y });
export const mul = (v: Vector2D, s: number): Vector2D => ({ x: v.x * s, y: v.y * s });
export const div = (v: Vector2D, s: number): Vector2D => ({ x: v.x / s, y: v.y / s });

// Vector operations
export const dot = (a: Vector2D, b: Vector2D): number => a.x * b.x + a.y * b.y;
export const cross = (a: Vector2D, b: Vector2D): number => a.x * b.y - a.y * b.x;
export const length = (v: Vector2D): number => Math.sqrt(v.x * v.x + v.y * v.y);
export const lengthSq = (v: Vector2D): number => v.x * v.x + v.y * v.y;

export const normalize = (v: Vector2D): Vector2D => {
  const len = length(v);
  return len > 0 ? div(v, len) : vec(0, 0);
};

export const distance = (a: Vector2D, b: Vector2D): number => length(sub(b, a));
export const distanceSq = (a: Vector2D, b: Vector2D): number => lengthSq(sub(b, a));

// Rotation
export const rotate = (v: Vector2D, angle: number): Vector2D => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: v.x * cos - v.y * sin,
    y: v.x * sin + v.y * cos
  };
};

export const angle = (v: Vector2D): number => Math.atan2(v.y, v.x);
export const angleBetween = (a: Vector2D, b: Vector2D): number => Math.acos(dot(normalize(a), normalize(b)));

// Lerp & interpolation
export const lerp = (a: Vector2D, b: Vector2D, t: number): Vector2D => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t
});

export const lerpAngle = (a: number, b: number, t: number): number => {
  let diff = b - a;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return a + diff * t;
};

// Quadratic Bezier
export const quadraticBezier = (p0: Vector2D, p1: Vector2D, p2: Vector2D, t: number): Vector2D => {
  const mt = 1 - t;
  return {
    x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
    y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y
  };
};

// Cubic Bezier
export const cubicBezier = (
  p0: Vector2D, 
  p1: Vector2D, 
  p2: Vector2D, 
  p3: Vector2D, 
  t: number
): Vector2D => {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const t2 = t * t;
  const t3 = t2 * t;
  
  return {
    x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
    y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y
  };
};

// Bezier tangent (velocity)
export const cubicBezierTangent = (
  p0: Vector2D, p1: Vector2D, p2: Vector2D, p3: Vector2D, t: number
): Vector2D => {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;
  
  return {
    x: 3 * mt2 * (p1.x - p0.x) + 6 * mt * t * (p2.x - p1.x) + 3 * t2 * (p3.x - p2.x),
    y: 3 * mt2 * (p1.y - p0.y) + 6 * mt * t * (p2.y - p1.y) + 3 * t2 * (p3.y - p2.y)
  };
};

// Catmull-Rom spline
export const catmullRom = (
  p0: Vector2D, p1: Vector2D, p2: Vector2D, p3: Vector2D, t: number
): Vector2D => {
  const t2 = t * t;
  const t3 = t2 * t;
  
  return {
    x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)
  };
};

// Perlin noise (simplified)
export const noise2D = (x: number, y: number, seed: number = 0): number => {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
  return n - Math.floor(n);
};

// Smooth noise
export const smoothNoise = (x: number, y: number, seed: number = 0): number => {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  
  const a = noise2D(ix, iy, seed);
  const b = noise2D(ix + 1, iy, seed);
  const c = noise2D(ix, iy + 1, seed);
  const d = noise2D(ix + 1, iy + 1, seed);
  
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  
  return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
};

// Fractal Brownian Motion
export const fbm = (
  x: number, 
  y: number, 
  octaves: number = 4, 
  lacunarity: number = 2,
  gain: number = 0.5,
  seed: number = 0
): number => {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;
  
  for (let i = 0; i < octaves; i++) {
    value += amplitude * smoothNoise(x * frequency, y * frequency, seed + i);
    maxValue += amplitude;
    amplitude *= gain;
    frequency *= lacunarity;
  }
  
  return value / maxValue;
};

// Path utilities
export const getBezierBounds = (
  p0: Vector2D, p1: Vector2D, p2: Vector2D, p3: Vector2D
): { minX: number; minY: number; maxX: number; maxY: number } => {
  const points: Vector2D[] = [];
  for (let t = 0; t <= 1; t += 0.01) {
    points.push(cubicBezier(p0, p1, p2, p3, t));
  }
  
  return {
    minX: Math.min(...points.map(p => p.x)),
    minY: Math.min(...points.map(p => p.y)),
    maxX: Math.max(...points.map(p => p.x)),
    maxY: Math.max(...points.map(p => p.y))
  };
};

// Transform utilities
export const transformPoint = (
  point: Vector2D,
  origin: Vector2D,
  rotation: number,
  scale: Vector2D
): Vector2D => {
  // Translate to origin
  let x = point.x - origin.x;
  let y = point.y - origin.y;
  
  // Scale
  x *= scale.x;
  y *= scale.y;
  
  // Rotate
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  const rx = x * cos - y * sin;
  const ry = x * sin + y * cos;
  
  // Translate back
  return { x: rx + origin.x, y: ry + origin.y };
};
