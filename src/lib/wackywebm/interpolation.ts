import bezier from "bezier-easing"

export interface Interpolation {
    (a: number, b: number, t: number): number
}

export const linear: Interpolation = (a, b, t) => {
    return Math.floor(a + t * (b - a))
}

export const ease: Interpolation = (a, b, t) => {
    let easing = bezier(.2, 0, .35, 1)
    return Math.floor(a + easing(t) * (b - a))
}

export const instant: Interpolation = (a, b, t) => {
    return t == 1 ? b : a
}