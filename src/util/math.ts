export function clamp(value: number, lowerBound: number, upperBound: number): number {
    return Math.max(lowerBound, Math.min(upperBound, value));
}

/**
 * Smoothly linearly changes a to b depending on parameter t.
 * If t is outside of [0, 1] range, it linearly extrapolates.
 */
export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

/**
 * Like lerp, but clamps tohe result to [a, b] range.
 */
export function clampedLerp(a: number, b: number, t: number): number {
    return clamp(lerp(a, b, t), a, b);
}

/**
 * Returns how much is the value moved along the [a, b] range
 * If result is 0, value = a
 * If result is 1, value = b
 * If result is < 0, value is behind a
 * If result is > 0, value is behind b
 */
export function inverseLerp(a: number, b: number, value: number): number {
    return (value - a) / (b - a);
}

/**
 * Like inverseLerp, but the result is clamped to [0, 1] range
 */
export function clampedInverseLerp(a: number, b: number, value: number): number {
    return clamp(inverseLerp(a, b, value), 0, 1);
}