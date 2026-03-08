// Color System - Professional color management
// RGB, HSL, LAB, and Look-Up Tables

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface LAB {
  l: number;
  a: number;
  b: number;
}

// Factory functions
export const rgb = (r: number, g: number, b: number): RGB => ({
  r: clamp(r, 0, 255),
  g: clamp(g, 0, 255),
  b: clamp(b, 0, 255)
});

export const hsl = (h: number, s: number, l: number): HSL => ({
  h: h % 360,
  s: clamp(s, 0, 100),
  l: clamp(l, 0, 100)
});

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

// Conversions
export const rgbToHex = (c: RGB): string => {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(c.r)}${toHex(c.g)}${toHex(c.b)}`;
};

export const hexToRgb = (hex: string): RGB => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? rgb(
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ) : rgb(0, 0, 0);
};

export const rgbToHsl = (c: RGB): HSL => {
  const r = c.r / 255;
  const g = c.g / 255;
  const b = c.b / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  
  if (max === min) {
    return hsl(0, 0, l * 100);
  }
  
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  
  let h: number;
  switch (max) {
    case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
    case g: h = ((b - r) / d + 2) * 60; break;
    default: h = ((r - g) / d + 4) * 60;
  }
  
  return hsl(h, s * 100, l * 100);
};

export const hslToRgb = (c: HSL): RGB => {
  const h = c.h / 360;
  const s = c.s / 100;
  const l = c.l / 100;
  
  if (s === 0) {
    const v = Math.round(l * 255);
    return rgb(v, v, v);
  }
  
  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  
  return rgb(
    Math.round(hue2rgb(p, q, h + 1/3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1/3) * 255)
  );
};

// Color operations
export const lighten = (c: RGB, amount: number): RGB => {
  const hsl = rgbToHsl(c);
  return hslToRgb({ ...hsl, l: Math.min(100, hsl.l + amount) });
};

export const darken = (c: RGB, amount: number): RGB => {
  const hsl = rgbToHsl(c);
  return hslToRgb({ ...hsl, l: Math.max(0, hsl.l - amount) });
};

export const saturate = (c: RGB, amount: number): RGB => {
  const hsl = rgbToHsl(c);
  return hslToRgb({ ...hsl, s: Math.min(100, hsl.s + amount) });
};

export const desaturate = (c: RGB, amount: number): RGB => {
  const hsl = rgbToHsl(c);
  return hslToRgb({ ...hsl, s: Math.max(0, hsl.s - amount) });
};

export const rotateHue = (c: RGB, degrees: number): RGB => {
  const hsl = rgbToHsl(c);
  return hslToRgb({ ...hsl, h: (hsl.h + degrees + 360) % 360 });
};

export const mix = (c1: RGB, c2: RGB, t: number): RGB => {
  return rgb(
    c1.r + (c2.r - c1.r) * t,
    c1.g + (c2.g - c1.g) * t,
    c1.b + (c2.b - c1.b) * t
  );
};

// Color schemes
export const complementary = (c: RGB): RGB => rotateHue(c, 180);
export const triadic = (c: RGB): RGB[] => [c, rotateHue(c, 120), rotateHue(c, 240)];
export const analogous = (c: RGB): RGB[] => [rotateHue(c, -30), c, rotateHue(c, 30)];
export const splitComplementary = (c: RGB): RGB[] => [c, rotateHue(c, 150), rotateHue(c, 210)];

// Gradients
export const linearGradient = (
  colors: RGB[],
  angle: number = 0
): string => {
  const stops = colors.map((c, i) => {
    const pos = (i / (colors.length - 1)) * 100;
    return `${rgbToHex(c)} ${pos}%`;
  }).join(', ');
  return `linear-gradient(${angle}deg, ${stops})`;
};

export const radialGradient = (
  colors: RGB[],
  shape: 'circle' | 'ellipse' = 'circle'
): string => {
  const stops = colors.map((c, i) => {
    const pos = (i / (colors.length - 1)) * 100;
    return `${rgbToHex(c)} ${pos}%`;
  }).join(', ');
  return `radial-gradient(${shape} at center, ${stops})`;
};

// Preset palettes
export const palettes = {
  // Cinematic
  cinematic: {
    background: rgb(3, 3, 8),
    primary: rgb(0, 170, 255),
    secondary: rgb(255, 102, 0),
    accent: rgb(255, 170, 0),
    text: rgb(255, 255, 255),
    muted: rgb(136, 136, 153),
  },
  
  // Quantum
  quantum: {
    background: rgb(3, 3, 8),
    primary: rgb(153, 51, 255),
    secondary: rgb(0, 255, 255),
    accent: rgb(255, 0, 255),
    text: rgb(255, 255, 255),
    muted: rgb(136, 136, 153),
  },
  
  // Nature
  nature: {
    background: rgb(5, 15, 8),
    primary: rgb(34, 139, 34),
    secondary: rgb(100, 200, 100),
    accent: rgb(255, 200, 100),
    text: rgb(255, 255, 255),
    muted: rgb(136, 153, 136),
  },
  
  // Fire
  fire: {
    background: rgb(15, 3, 3),
    primary: rgb(255, 68, 0),
    secondary: rgb(255, 136, 0),
    accent: rgb(255, 220, 100),
    text: rgb(255, 255, 255),
    muted: rgb(153, 102, 68),
  },
  
  // Ocean
  ocean: {
    background: rgb(3, 8, 15),
    primary: rgb(0, 100, 200),
    secondary: rgb(0, 170, 255),
    accent: rgb(100, 220, 255),
    text: rgb(255, 255, 255),
    muted: rgb(68, 102, 136),
  },
  
  // Matrix
  matrix: {
    background: rgb(0, 8, 0),
    primary: rgb(0, 200, 0),
    secondary: rgb(50, 255, 50),
    accent: rgb(150, 255, 150),
    text: rgb(200, 255, 200),
    muted: rgb(68, 136, 68),
  },
};

// Color interpolation (smooth)
export const lerpColor = (c1: RGB, c2: RGB, t: number): RGB => mix(c1, c2, t);

// Get color at position in gradient
export const gradientAt = (colors: RGB[], t: number): RGB => {
  t = clamp(t, 0, 1);
  const scaled = t * (colors.length - 1);
  const i = Math.floor(scaled);
  const f = scaled - i;
  
  if (i >= colors.length - 1) return colors[colors.length - 1];
  return mix(colors[i], colors[i + 1], f);
};

// Apply LUT (look-up table) for color grading
export const applyLUT = (
  color: RGB,
  lut: (c: RGB) => RGB
): RGB => lut(color);

// Preset LUTs
export const luts = {
  // High contrast
  contrast: (c: RGB): RGB => rgb(
    c.r < 128 ? c.r * 0.5 : 255 - (255 - c.r) * 0.5,
    c.g < 128 ? c.g * 0.5 : 255 - (255 - c.g) * 0.5,
    c.b < 128 ? c.b * 0.5 : 255 - (255 - c.b) * 0.5
  ),
  
  // Warm
  warm: (c: RGB): RGB => {
    const hsl = rgbToHsl(c);
    return hslToRgb({ ...hsl, h: (hsl.h + 20) % 360, s: Math.min(100, hsl.s + 10) });
  },
  
  // Cool
  cool: (c: RGB): RGB => {
    const hsl = rgbToHsl(c);
    return hslToRgb({ ...hsl, h: (hsl.h - 20 + 360) % 360, s: Math.min(100, hsl.s + 10) });
  },
  
  // Vintage
  vintage: (c: RGB): RGB => {
    const hsl = rgbToHsl(c);
    return hslToRgb({ ...hsl, s: hsl.s * 0.7, l: Math.min(100, hsl.l * 1.1) });
  },
  
  // Noir
  noir: (c: RGB): RGB => {
    const gray = 0.299 * c.r + 0.587 * c.g + 0.114 * c.b;
    return rgb(gray, gray, gray);
  },
  
  // Fade
  fade: (c: RGB): RGB => {
    const hsl = rgbToHsl(c);
    return hslToRgb({ ...hsl, s: hsl.s * 0.3, l: Math.min(100, hsl.l * 1.2) });
  },
};
