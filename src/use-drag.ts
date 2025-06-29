import { useState, useCallback, useRef, useEffect } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import type { Position, DragState } from './types'
import { constrainToViewport, applyEdgeSnapping } from './helpers'
import { DEFAULT_POSITION, SNAP_THRESHOLD, DRAG_CLASS } from './constants'

interface UseDragOptions {
	initialPosition?: Position
	constrainToViewport?: boolean
	snapToEdges?: boolean
	snapThreshold?: number
	onDragStart?: () => void
	onDragEnd?: () => void
	onDrag?: (position: Position) => void
}

export function useDrag({
	initialPosition = DEFAULT_POSITION,
	constrainToViewport: shouldConstrainToViewport = true,
	snapToEdges = false,
	snapThreshold = SNAP_THRESHOLD,
	onDragStart,
	onDragEnd,
	onDrag,
}: UseDragOptions = {}) {
	const [position, setPosition] = useState<Position>(initialPosition)
	const [dragState, setDragState] = useState<DragState>({
		isDragging: false,
		dragOffset: { x: 0, y: 0 },
		startPosition: initialPosition,
		currentPosition: initialPosition,
	})

	const elementRef = useRef<HTMLDivElement>(null)
	const dragStartTime = useRef<Date | null>(null)

	const handlePosition = useCallback(
		(pos: Position, elementRect?: DOMRect): Position => {
			if (!shouldConstrainToViewport) return pos

			const rect = elementRect || elementRef.current?.getBoundingClientRect()
			if (!rect) return pos

			let constrainedPos = constrainToViewport(pos, rect)

			if (snapToEdges) {
				constrainedPos = applyEdgeSnapping(constrainedPos, rect, snapThreshold)
			}

			return constrainedPos
		},
		[shouldConstrainToViewport, snapToEdges, snapThreshold]
	)

	const handleMouseDown = useCallback(
		(event: ReactMouseEvent | MouseEvent) => {
			event.preventDefault()
			const rect = elementRef.current?.getBoundingClientRect()
			if (!rect) return

			dragStartTime.current = new Date()
			const startPos = { x: position.x, y: position.y }
			const offset = {
				x: event.clientX - rect.left,
				y: event.clientY - rect.top,
			}

			setDragState({
				isDragging: true,
				dragOffset: offset,
				startPosition: startPos,
				currentPosition: startPos,
			})

			// Add drag class for styling
			if (elementRef.current) {
				elementRef.current.classList.add(DRAG_CLASS)
			}

			onDragStart?.()
		},
		[position, onDragStart]
	)

	const handleMouseMove = useCallback(
		(event: MouseEvent | PointerEvent) => {
			if (!dragState.isDragging) return

			const newPosition = {
				x: event.clientX - dragState.dragOffset.x,
				y: event.clientY - dragState.dragOffset.y,
			}

			const constrainedPosition = handlePosition(newPosition)
			setPosition(constrainedPosition)
			setDragState((prev: DragState) => ({
				...prev,
				currentPosition: constrainedPosition,
			}))

			onDrag?.(constrainedPosition)
		},
		[dragState.isDragging, dragState.dragOffset, handlePosition, onDrag]
	)

	const handleMouseUp = useCallback(() => {
		if (!dragState.isDragging) return

		setDragState((prev: DragState) => ({
			...prev,
			isDragging: false,
		}))

		// Remove drag class
		if (elementRef.current) {
			elementRef.current.classList.remove(DRAG_CLASS)
		}

		onDragEnd?.()
	}, [dragState.isDragging, onDragEnd])

	// Set up global event listeners for both mouse and pointer events
	useEffect(() => {
		if (dragState.isDragging) {
			// Support both mouse and pointer events
			const handleMove = (e: Event) =>
				handleMouseMove(e as MouseEvent | PointerEvent)
			const handleUp = () => handleMouseUp()

			// Add both mouse and pointer event listeners
			document.addEventListener('mousemove', handleMove)
			document.addEventListener('mouseup', handleUp)
			document.addEventListener('pointermove', handleMove)
			document.addEventListener('pointerup', handleUp)

			// Prevent text selection and set cursor
			document.body.style.userSelect = 'none'
			document.body.style.cursor = 'grabbing'

			return () => {
				document.removeEventListener('mousemove', handleMove)
				document.removeEventListener('mouseup', handleUp)
				document.removeEventListener('pointermove', handleMove)
				document.removeEventListener('pointerup', handleUp)
				document.body.style.userSelect = ''
				document.body.style.cursor = ''
			}
		}
	}, [dragState.isDragging, handleMouseMove, handleMouseUp])

	// Update position when initialPosition changes
	useEffect(() => {
		setPosition(handlePosition(initialPosition))
	}, [initialPosition, handlePosition])

	return {
		position,
		dragState,
		elementRef,
		handleMouseDown,
		setPosition: (newPosition: Position) => {
			const constrainedPosition = handlePosition(newPosition)
			setPosition(constrainedPosition)
			setDragState((prev: DragState) => ({
				...prev,
				currentPosition: constrainedPosition,
			}))
		},
	}
}
