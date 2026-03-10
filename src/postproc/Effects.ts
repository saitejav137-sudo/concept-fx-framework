// Post-Processing Effects Pipeline
// Professional-grade visual effects

// Effect types
export interface Effect {
  name: string;
  apply: (input: ImageData) => ImageData;
}

// Blur effect (Gaussian)
export const gaussianBlur = (radius: number = 3): Effect => ({
  name: 'gaussianBlur',
  apply: (input: ImageData): ImageData => {
    const output = new ImageData(
      new Uint8ClampedArray(input.data),
      input.width,
      input.height
    );
    
    const kernel = generateGaussianKernel(radius);
    const side = Math.floor(kernel.length / 2);
    
    for (let y = side; y < input.height - side; y++) {
      for (let x = side; x < input.width - side; x++) {
        let r = 0, g = 0, b = 0, a = 0;
        
        for (let ky = -side; ky <= side; ky++) {
          for (let kx = -side; kx <= side; kx++) {
            const idx = ((y + ky) * input.width + (x + kx)) * 4;
            const weight = kernel[ky + side][kx + side];
            
            r += input.data[idx] * weight;
            g += input.data[idx + 1] * weight;
            b += input.data[idx + 2] * weight;
            a += input.data[idx + 3] * weight;
          }
        }
        
        const outIdx = (y * input.width + x) * 4;
        output.data[outIdx] = r;
        output.data[outIdx + 1] = g;
        output.data[outIdx + 2] = b;
        output.data[outIdx + 3] = a;
      }
    }
    
    return output;
  }
});

const generateGaussianKernel = (radius: number): number[][] => {
  const kernel: number[][] = [];
  const sigma = radius / 3;
  let sum = 0;
  
  for (let y = -radius; y <= radius; y++) {
    kernel[y + radius] = [];
    for (let x = -radius; x <= radius; x++) {
      const value = Math.exp(-(x * x + y * y) / (2 * sigma * sigma));
      kernel[y + radius][x + radius] = value;
      sum += value;
    }
  }
  
  // Normalize
  for (let y = 0; y < kernel.length; y++) {
    for (let x = 0; x < kernel[y].length; x++) {
      kernel[y][x] /= sum;
    }
  }
  
  return kernel;
};

// Motion blur (directional)
export const motionBlur = (angle: number = 0, intensity: number = 5): Effect => ({
  name: 'motionBlur',
  apply: (input: ImageData): ImageData => {
    const output = new ImageData(
      new Uint8ClampedArray(input.data),
      input.width,
      input.height
    );
    
    const rad = (angle * Math.PI) / 180;
    const dx = Math.cos(rad) * intensity;
    const dy = Math.sin(rad) * intensity;
    const steps = Math.ceil(Math.abs(dx) + Math.abs(dy));
    
    for (let y = 0; y < input.height; y++) {
      for (let x = 0; x < input.width; x++) {
        let r = 0, g = 0, b = 0, count = 0;
        
        for (let s = 0; s <= steps; s++) {
          const px = Math.round(x + (dx * s) / steps);
          const py = Math.round(y + (dy * s) / steps);
          
          if (px >= 0 && px < input.width && py >= 0 && py < input.height) {
            const idx = (py * input.width + px) * 4;
            r += input.data[idx];
            g += input.data[idx + 1];
            b += input.data[idx + 2];
            count++;
          }
        }
        
        const outIdx = (y * input.width + x) * 4;
        output.data[outIdx] = r / count;
        output.data[outIdx + 1] = g / count;
        output.data[outIdx + 2] = b / count;
        output.data[outIdx + 3] = input.data[outIdx + 3];
      }
    }
    
    return output;
  }
});

// Bloom/Glow effect
export const bloom = (threshold: number = 200, intensity: number = 0.5): Effect => ({
  name: 'bloom',
  apply: (input: ImageData): ImageData => {
    const output = new ImageData(
      new Uint8ClampedArray(input.data),
      input.width,
      input.height
    );
    
    // Extract bright areas
    const bright = new Uint8ClampedArray(input.width * input.height * 4);
    for (let i = 0; i < input.data.length; i += 4) {
      const brightness = (input.data[i] + input.data[i + 1] + input.data[i + 2]) / 3;
      if (brightness > threshold) {
        bright[i] = input.data[i];
        bright[i + 1] = input.data[i + 1];
        bright[i + 2] = input.data[i + 2];
        bright[i + 3] = 255;
      }
    }
    
    // Blur bright areas (simplified)
    const blurRadius = 5;
    for (let y = blurRadius; y < input.height - blurRadius; y++) {
      for (let x = blurRadius; x < input.width - blurRadius; x++) {
        let br = 0, bg = 0, bb = 0, count = 0;
        
        for (let ky = -blurRadius; ky <= blurRadius; ky++) {
          for (let kx = -blurRadius; kx <= blurRadius; kx++) {
            const idx = ((y + ky) * input.width + (x + kx)) * 4;
            br += bright[idx];
            bg += bright[idx + 1];
            bb += bright[idx + 2];
            count++;
          }
        }
        
        const outIdx = (y * input.width + x) * 4;
        output.data[outIdx] = Math.min(255, input.data[outIdx] + (br / count) * intensity);
        output.data[outIdx + 1] = Math.min(255, input.data[outIdx + 1] + (bg / count) * intensity);
        output.data[outIdx + 2] = Math.min(255, input.data[outIdx + 2] + (bb / count) * intensity);
      }
    }
    
    return output;
  }
});

// Chromatic aberration
export const chromaticAberration = (offset: number = 3): Effect => ({
  name: 'chromaticAberration',
  apply: (input: ImageData): ImageData => {
    const output = new ImageData(
      new Uint8ClampedArray(input.data),
      input.width,
      input.height
    );
    
    for (let y = 0; y < input.height; y++) {
      for (let x = 0; x < input.width; x++) {
        const outIdx = (y * input.width + x) * 4;
        
        // Red shift
        const rX = Math.min(input.width - 1, Math.max(0, x + offset));
        const rIdx = (y * input.width + rX) * 4;
        
        // Blue shift
        const bX = Math.min(input.width - 1, Math.max(0, x - offset));
        const bIdx = (y * input.width + bX) * 4;
        
        output.data[outIdx] = input.data[rIdx];
        output.data[outIdx + 1] = input.data[outIdx + 1];
        output.data[outIdx + 2] = input.data[bIdx + 2];
        output.data[outIdx + 3] = input.data[outIdx + 3];
      }
    }
    
    return output;
  }
});

// Vignette
export const vignette = (intensity: number = 0.5, softness: number = 0.5): Effect => ({
  name: 'vignette',
  apply: (input: ImageData): ImageData => {
    const output = new ImageData(
      new Uint8ClampedArray(input.data),
      input.width,
      input.height
    );
    
    const cx = input.width / 2;
    const cy = input.height / 2;
    const maxDist = Math.sqrt(cx * cx + cy * cy);
    
    for (let y = 0; y < input.height; y++) {
      for (let x = 0; x < input.width; x++) {
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) / maxDist;
        
        let vignette = 1 - Math.pow(Math.max(0, dist - (1 - softness)) / softness, intensity);
        vignette = Math.max(0, Math.min(1, vignette));
        
        const idx = (y * input.width + x) * 4;
        output.data[idx] = input.data[idx] * vignette;
        output.data[idx + 1] = input.data[idx + 1] * vignette;
        output.data[idx + 2] = input.data[idx + 2] * vignette;
        output.data[idx + 3] = input.data[idx + 3];
      }
    }
    
    return output;
  }
});

// Film grain
export const filmGrain = (intensity: number = 0.1, seed: number = 0): Effect => ({
  name: 'filmGrain',
  apply: (input: ImageData): ImageData => {
    const output = new ImageData(
      new Uint8ClampedArray(input.data),
      input.width,
      input.height
    );
    
    const random = (x: number, y: number): number => {
      const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
      return n - Math.floor(n);
    };
    
    for (let i = 0; i < input.data.length; i += 4) {
      const x = (i / 4) % input.width;
      const y = Math.floor((i / 4) / input.width);
      const grain = (random(x, y) - 0.5) * intensity * 255;
      
      output.data[i] = Math.max(0, Math.min(255, input.data[i] + grain));
      output.data[i + 1] = Math.max(0, Math.min(255, input.data[i + 1] + grain));
      output.data[i + 2] = Math.max(0, Math.min(255, input.data[i + 2] + grain));
      output.data[i + 3] = input.data[i + 3];
    }
    
    return output;
  }
});

// Noise reduction (simplified)
export const denoise = (strength: number = 0.5): Effect => ({
  name: 'denoise',
  apply: (input: ImageData): ImageData => {
    const output = new ImageData(
      new Uint8ClampedArray(input.data),
      input.width,
      input.height
    );
    
    for (let y = 1; y < input.height - 1; y++) {
      for (let x = 1; x < input.width - 1; x++) {
        const outIdx = (y * input.width + x) * 4;
        
        let r = 0, g = 0, b = 0, count = 0;
        
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * input.width + (x + kx)) * 4;
            r += input.data[idx];
            g += input.data[idx + 1];
            b += input.data[idx + 2];
            count++;
          }
        }
        
        const originalR = input.data[outIdx];
        const originalG = input.data[outIdx + 1];
        const originalB = input.data[outIdx + 2];
        
        output.data[outIdx] = originalR + (r / count - originalR) * strength;
        output.data[outIdx + 1] = originalG + (g / count - originalG) * strength;
        output.data[outIdx + 2] = originalB + (b / count - originalB) * strength;
        output.data[outIdx + 3] = input.data[outIdx + 3];
      }
    }
    
    return output;
  }
});

// Sharpen
export const sharpen = (amount: number = 1): Effect => ({
  name: 'sharpen',
  apply: (input: ImageData): ImageData => {
    const output = new ImageData(
      new Uint8ClampedArray(input.data),
      input.width,
      input.height
    );
    
    const kernel = [
      0, -1, 0,
      -1, 5, -1,
      0, -1, 0
    ];
    
    for (let y = 1; y < input.height - 1; y++) {
      for (let x = 1; x < input.width - 1; x++) {
        let r = 0, g = 0, b = 0;
        
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * input.width + (x + kx)) * 4;
            const k = kernel[(ky + 1) * 3 + (kx + 1)];
            
            r += input.data[idx] * k;
            g += input.data[idx + 1] * k;
            b += input.data[idx + 2] * k;
          }
        }
        
        const outIdx = (y * input.width + x) * 4;
        const originalR = input.data[outIdx];
        const originalG = input.data[outIdx + 1];
        const originalB = input.data[outIdx + 2];
        
        output.data[outIdx] = Math.max(0, Math.min(255, originalR + (r - originalR) * amount));
        output.data[outIdx + 1] = Math.max(0, Math.min(255, originalG + (g - originalG) * amount));
        output.data[outIdx + 2] = Math.max(0, Math.min(255, originalB + (b - originalB) * amount));
        output.data[outIdx + 3] = input.data[outIdx + 3];
      }
    }
    
    return output;
  }
});

// Compose multiple effects
export const composeEffects = (...effects: Effect[]): Effect => ({
  name: 'composed',
  apply: (input: ImageData): ImageData => {
    let result = input;
    for (const effect of effects) {
      result = effect.apply(result);
    }
    return result;
  }
});

// Sepia effect as a named export
export const sepiaEffect: Effect = {
  name: 'sepia',
  apply: (input: ImageData): ImageData => {
    const output = new ImageData(new Uint8ClampedArray(input.data), input.width, input.height);
    for (let i = 0; i < input.data.length; i += 4) {
      const r = input.data[i], g = input.data[i + 1], b = input.data[i + 2];
      output.data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
      output.data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
      output.data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
      output.data[i + 3] = input.data[i + 3];
    }
    return output;
  }
};

// Preset effect chains
export const presets = {
  cinematic: composeEffects(
    vignette(0.4, 0.6),
    filmGrain(0.05, 12345),
    chromaticAberration(2)
  ),
  
  vintage: composeEffects(
    vignette(0.3, 0.5),
    filmGrain(0.08, 54321),
    sepiaEffect
  ),

  glow: composeEffects(
    bloom(180, 0.6),
    vignette(0.2, 0.7)
  ),

  sharp: sharpen(0.8),

  smooth: denoise(0.4),
};
