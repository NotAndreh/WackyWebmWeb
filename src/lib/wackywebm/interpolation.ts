import bezier from "bezier-easing"

export interface Interpolation {
    (a: number, b: number, t: number): number
}

export const instant: Interpolation = (a, b, t) => {
    return t == 1 ? b : a
}

export const linear: Interpolation = (a, b, t) => {
    return Math.floor(a + t * (b - a))
}

export const ease: Interpolation = (a, b, t) => {
    let easing = bezier(.2, 0, .35, 1)
    return Math.floor(a + easing(t) * (b - a))
}

export const easeIn: Interpolation = (a, b, t) => {
    let easing = bezier(.42, 0, 1, 1)
    return Math.floor(a + easing(t) * (b - a))
}

export const easeOut: Interpolation = (a, b, t) => {
    let easing = bezier(0, 0, .58, 1)
    return Math.floor(a + easing(t) * (b - a))
}
