// This code comes from https://github.com/radix-ui/primitives/tree/main/packages/react/compose-refs

import * as React from 'react'

type PossibleRef<T> = React.Ref<T> | undefined

/**
 * Set a given ref to a given value
 * This utility takes care of different types of refs: callback refs and RefObject(s)
 */
function setRef<T>(ref: PossibleRef<T>, value: T) {
	if (typeof ref === 'function') {
		ref(value)
	} else if (ref !== null && ref !== undefined) {
		;(ref as React.MutableRefObject<T>).current = value
	}
}

/**
 * A utility to compose multiple refs together
 * Accepts callback refs and RefObject(s)
 */
function composeRefs<T>(...refs: PossibleRef<T>[]) {
	return (node: T) => refs.forEach(ref => setRef(ref, node))
}

/**
 * A custom hook that composes multiple refs
 * Accepts callback refs and RefObject(s)
 */
function useComposedRefs<T>(...refs: PossibleRef<T>[]) {
	return React.useCallback((node: T) => {
		refs.forEach(ref => {
			if (typeof ref === 'function') {
				ref(node)
			} else if (ref != null) {
				;(ref as React.MutableRefObject<T>).current = node
			}
		})
	}, refs)
}

export { composeRefs, useComposedRefs }
