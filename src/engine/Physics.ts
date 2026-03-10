// Physics Engine - Professional physics simulation for motion graphics
// Includes friction, velocity damping, and surface physics

import { Vector2D, vec, length, mul } from './Vector2D.js';

// ============ FRICTION TYPES ============

export interface PhysicsBody {
  position: Vector2D;
  velocity: Vector2D;
  acceleration: Vector2D;
  mass: number;
}

export interface FrictionConfig {
  /** Coefficient of friction (0-1, higher = more friction) */
  coefficient: number;
  /** Air resistance (0-1, higher = more drag) */
  airResistance: number;
  /** Surface type for realistic friction */
  surface: 'ice' | 'wood' | 'metal' | 'rubber' | 'sand' | 'custom';
}

// Preset friction coefficients for different surfaces
export const surfaceFriction: Record<FrictionConfig['surface'], number> = {
  ice: 0.05,
  wood: 0.3,
  metal: 0.4,
  rubber: 0.8,
  sand: 0.9,
  custom: 0.5,
};

// ============ FRICTION FUNCTIONS ============

/**
 * Apply friction to reduce velocity over time
 * Returns the new velocity after friction is applied
 */
export const applyFriction = (
  velocity: Vector2D,
  friction: number,
  dt: number
): Vector2D => {
  const speed = length(velocity);
  if (speed < 0.0001) return vec(0, 0);

  // Friction force opposes motion
  const frictionForce = friction * 9.81; // Simplified friction model
  const reduction = Math.min(frictionForce * dt, speed);

  // Normalize and scale down velocity
  const normalized = mul(velocity, 1 / speed);
  const newSpeed = Math.max(0, speed - reduction);

  return mul(normalized, newSpeed);
};

/**
 * Apply air resistance (drag) to velocity
 * Uses quadratic drag model: F = -c * v^2
 */
export const applyAirResistance = (
  velocity: Vector2D,
  dragCoefficient: number,
  dt: number
): Vector2D => {
  const speed = length(velocity);
  if (speed < 0.0001) return vec(0, 0);

  // Quadratic drag
  const dragMagnitude = dragCoefficient * speed * speed;
  const dragForce = Math.min(dragMagnitude * dt, speed);

  const normalized = mul(velocity, 1 / speed);
  const newSpeed = Math.max(0, speed - dragForce);

  return mul(normalized, newSpeed);
};

/**
 * Combined friction and air resistance
 */
export const applyPhysicsDrag = (
  velocity: Vector2D,
  friction: number,
  airResistance: number,
  dt: number
): Vector2D => {
  let newVel = applyFriction(velocity, friction, dt);
  newVel = applyAirResistance(newVel, airResistance, dt);
  return newVel;
};

// ============ PHYSICS BODY FUNCTIONS ============

/**
 * Create a new physics body
 */
export const createBody = (
  position: Vector2D,
  velocity: Vector2D = vec(0, 0),
  mass: number = 1
): PhysicsBody => ({
  position,
  velocity,
  acceleration: vec(0, 0),
  mass,
});

/**
 * Update physics body with friction
 */
export const updateBody = (
  body: PhysicsBody,
  friction: number,
  airResistance: number,
  dt: number
): PhysicsBody => {
  // Apply drag
  const newVelocity = applyPhysicsDrag(body.velocity, friction, airResistance, dt);

  // Update position based on velocity
  const newPosition = {
    x: body.position.x + newVelocity.x * dt,
    y: body.position.y + newVelocity.y * dt,
  };

  return {
    ...body,
    position: newPosition,
    velocity: newVelocity,
  };
};

// ============ EASING FROM PHYSICS ============

/**
 * Creates an easing function from friction physics
 * Useful for natural deceleration animations
 */
export const frictionEasing = (friction: number = 0.3): ((t: number) => number) => {
  return (t: number): number => {
    if (t >= 1) return 1;
    if (t <= 0) return 0;

    // Physics-based deceleration curve
    const velocity = 1 - friction * t;
    return Math.max(0, 1 - velocity * velocity);
  };
};

/**
 * Creates a damping easing from spring physics
 * This is a velocity-based easing that mimics underdamped spring
 */
export const dampingEasing = (
  stiffness: number = 100,
  damping: number = 10
): ((t: number) => number) => {
  const omega = Math.sqrt(stiffness);
  const zeta = damping / (2 * Math.sqrt(stiffness));

  return (t: number): number => {
    if (t >= 1) return 1;
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

/**
 * Creates an exponential decay easing
 * Useful for friction-like deceleration
 */
export const exponentialDecay = (decay: number = 2): ((t: number) => number) => {
  return (t: number): number => {
    if (t >= 1) return 1;
    return 1 - Math.exp(-decay * t);
  };
};

/**
 * Creates a friction-based deceleration curve
 * More natural-looking than simple exponential
 */
export const frictionDecel = (
  friction: number = 0.5,
  minVelocity: number = 0.01
): ((t: number) => number) => {
  // Calculate time to reach minVelocity
  const timeToStop = -Math.log(minVelocity) / friction;

  return (t: number): number => {
    if (t >= 1) return 1;
    if (t <= 0) return 0;

    const scaledT = t * timeToStop;
    return 1 - Math.exp(-friction * scaledT);
  };
};

// ============ PRESET FRICTION CONFIGURATIONS ============

export const frictionPresets = {
  /** Very slippery, like ice */
  ice: {
    coefficient: surfaceFriction.ice,
    airResistance: 0.01,
    surface: 'ice' as const,
  },
  /** Smooth surface like wood */
  wood: {
    coefficient: surfaceFriction.wood,
    airResistance: 0.02,
    surface: 'wood' as const,
  },
  /** Metal surface */
  metal: {
    coefficient: surfaceFriction.metal,
    airResistance: 0.03,
    surface: 'metal' as const,
  },
  /** High friction like rubber */
  rubber: {
    coefficient: surfaceFriction.rubber,
    airResistance: 0.05,
    surface: 'rubber' as const,
  },
  /** Very high friction like sand */
  sand: {
    coefficient: surfaceFriction.sand,
    airResistance: 0.1,
    surface: 'sand' as const,
  },
  /** Smooth sliding animation */
  smooth: {
    coefficient: 0.15,
    airResistance: 0.01,
    surface: 'custom' as const,
  },
  /** Quick stop */
  quick: {
    coefficient: 0.6,
    airResistance: 0.05,
    surface: 'custom' as const,
  },
  /** No friction ( perpetual motion) */
  none: {
    coefficient: 0,
    airResistance: 0,
    surface: 'custom' as const,
  },
};

// ============ UTILITY FUNCTIONS ============

/**
 * Calculate the final position after applying friction over time
 */
export const calculateFrictionDistance = (
  initialVelocity: number,
  friction: number,
  maxTime: number = 1
): number => {
  // Distance = v0 * t - 0.5 * friction * t^2 (simplified)
  // Using exponential decay model for more realism
  const decay = friction * 10;
  return initialVelocity * (1 - Math.exp(-decay * maxTime)) / decay;
};

/**
 * Get velocity at time t given initial velocity and friction
 */
export const velocityAtTime = (
  initialVelocity: number,
  friction: number,
  t: number
): number => {
  const decay = friction * 10;
  return initialVelocity * Math.exp(-decay * t);
};

/**
 * Get time to stop given initial velocity and friction
 */
export const timeToStop = (
  initialVelocity: number,
  friction: number,
  minVelocity: number = 0.001
): number => {
  const decay = friction * 10;
  return -Math.log(minVelocity / initialVelocity) / decay;
};
