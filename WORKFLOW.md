# Pro FX Framework - Professional Motion Graphics

**Location:** `/home/saiteja_v137/.openclaw/workspace/pro-fx-framework/`

## What's Included

### Engine Core (src/engine/)
- **Easing.ts** - 20+ bezier-based easing functions, spring physics
- **Vector2D.ts** - Complete 2D math library (bezier, catmull-rom, noise)
- **Color.ts** - RGB/HSL/LAB color spaces, LUTs, palettes

### Post-Processing (src/postproc/)
- **Effects.ts** - Gaussian blur, motion blur, bloom, chromatic aberration, vignette, film grain

### Demo
- **index.tsx** - 45-second demo showcasing features

## 4-Agent Workflow

### Agent 1: RESEARCH
**Task:** Research the topic
**Output:** `research.md`
**Location:** `/workspace/video-jobs/[topic]/research.md`

### Agent 2: VISUAL
**Task:** Read research.md, create VISUAL_SPEC.md
**Input:** `/workspace/video-jobs/[topic]/research.md`
**Output:** `/workspace/video-jobs/[topic]/VISUAL_SPEC.md`

### Agent 3: CODE  
**Task:** Read VISUAL_SPEC.md, create video code
**Input:** 
- SPEC from Agent 2
- Framework at `/pro-fx-framework/src/`
**Output:** `/pro-fx-framework/src/index.tsx`
**Notes:** DO NOT create new directories. Edit existing framework files.

### Agent 4: RENDER
**Task:** Read SPEC, build & verify
**Input:** 
- SPEC from Agent 2
- Code from Agent 3
**Commands:**
```bash
cd /home/saiteja_v137/.openclaw/workspace/pro-fx-framework
npm run build
```
**Output:** `/pro-fx-framework/out/video.mp4`

## Key Principles

1. **READ FIRST** - Each agent reads previous output before starting
2. **EXPLICIT PATHS** - Always use full paths
3. **VALIDATE** - Render agent validates against spec
4. **NO DUPLICATE** - Don't run npm install (already done)

## Quick Commands

```bash
# Build video
cd /home/saiteja_v137/.openclaw/workspace/pro-fx-framework && npm run build
```

## Post-Processing Presets
```typescript
import { presets } from './postproc/Effects';
presets.cinematic  // vignette + grain + chromatic
presets.vintage    // sepia + vignette
presets.glow       // bloom + vignette
```
