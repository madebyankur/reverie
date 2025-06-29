import { AnyFunction, Position } from './types'

interface Style {
	[key: string]: string
}

const cache = new WeakMap()

export function isInView(el: HTMLElement): boolean {
	const rect = el.getBoundingClientRect()

	if (!window.visualViewport) return false

	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		// Need + 40 for safari detection
		rect.bottom <= window.visualViewport.height - 40 &&
		rect.right <= window.visualViewport.width
	)
}

export function set(
	el: Element | HTMLElement | null | undefined,
	styles: Style,
	ignoreCache = false
) {
	if (!el || !(el instanceof HTMLElement)) return
	let originalStyles: Style = {}

	Object.keys(styles).forEach((key: string) => {
		const value = styles[key]
		if (key.startsWith('--')) {
			el.style.setProperty(key, value)
			return
		}

		originalStyles[key] = (el.style as any)[key]
		;(el.style as any)[key] = value
	})

	if (ignoreCache) return

	cache.set(el, originalStyles)
}

export function reset(el: Element | HTMLElement | null, prop?: string) {
	if (!el || !(el instanceof HTMLElement)) return
	let originalStyles = cache.get(el)

	if (!originalStyles) {
		return
	}

	if (prop) {
		(el.style as any)[prop] = originalStyles[prop]
	} else {
		Object.keys(originalStyles).forEach((key: string) => {
			(el.style as any)[key] = originalStyles[key]
		})
	}
}

export function getTranslate(element: HTMLElement): Position | null {
	if (!element) {
		return null
	}
	const style = window.getComputedStyle(element)
	const transform =
		// @ts-ignore
		style.transform || style.webkitTransform || style.mozTransform
	let mat = transform.match(/^matrix3d\((.+)\)$/)
	if (mat) {
		// https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix3d
		return {
			x: parseFloat(mat[1].split(', ')[12]),
			y: parseFloat(mat[1].split(', ')[13]),
		}
	}
	// https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix
	mat = transform.match(/^matrix\((.+)\)$/)
	return mat
		? {
				x: parseFloat(mat[1].split(', ')[4]),
				y: parseFloat(mat[1].split(', ')[5]),
			}
		: null
}

export function dampenValue(v: number) {
	return 8 * (Math.log(v + 1) - 2)
}

export function assignStyle(
	element: HTMLElement | null | undefined,
	style: Partial<CSSStyleDeclaration>
) {
	if (!element) return () => {}

	const prevStyle = element.style.cssText
	Object.assign(element.style, style)

	return () => {
		element.style.cssText = prevStyle
	}
}

/**
 * Receives functions as arguments and returns a new function that calls all.
 */
export function chain<T extends AnyFunction>(...fns: T[]) {
	return (...args: Parameters<T>) => {
		for (const fn of fns) {
			if (typeof fn === 'function') {
				fn(...args)
			}
		}
	}
}

/**
 * Constrains a position to viewport bounds
 */
export function constrainToViewport(
	position: Position,
	elementRect: DOMRect
): Position {
	const viewportWidth = window.innerWidth
	const viewportHeight = window.innerHeight

	let { x, y } = position

	// Constrain to viewport bounds
	x = Math.max(0, Math.min(x, viewportWidth - elementRect.width))
	y = Math.max(0, Math.min(y, viewportHeight - elementRect.height))

	return { x, y }
}

/**
 * Applies edge snapping to a position
 */
export function applyEdgeSnapping(
	position: Position,
	elementRect: DOMRect,
	snapThreshold: number
): Position {
	const viewportWidth = window.innerWidth
	const viewportHeight = window.innerHeight

	let { x, y } = position

	// Snap to left edge
	if (x <= snapThreshold) x = 0
	// Snap to right edge
	if (x >= viewportWidth - elementRect.width - snapThreshold) {
		x = viewportWidth - elementRect.width
	}
	// Snap to top edge
	if (y <= snapThreshold) y = 0
	// Snap to bottom edge
	if (y >= viewportHeight - elementRect.height - snapThreshold) {
		y = viewportHeight - elementRect.height
	}

	return { x, y }
}

/**
 * Calculates velocity from two positions and time difference
 */
export function calculateVelocity(
	startPos: Position,
	endPos: Position,
	timeDiff: number
): number {
	const distance = Math.sqrt(
		Math.pow(endPos.x - startPos.x, 2) + Math.pow(endPos.y - startPos.y, 2)
	)
	return distance / timeDiff
}
