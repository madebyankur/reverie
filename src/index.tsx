'use client'

import * as React from 'react'
import {
	useFloating,
	autoUpdate,
	offset,
	flip,
	shift,
	useClick,
	useDismiss,
	useRole,
	useInteractions,
	FloatingFocusManager,
	FloatingPortal,
	useId,
} from '@floating-ui/react'
import type { VirtualElement } from '@floating-ui/react'
import { useControllableState } from './use-controllable-state'
import { useDrag } from './use-drag'
import './style.css'
import type {
	Position,
	DragState,
	WidgetSize,
	CloseButtonProps,
	WidgetHeaderProps,
	WidgetFooterProps,
} from './types'

export interface WidgetProps {
	open?: boolean
	onOpenChange?: (open: boolean) => void
	defaultOpen?: boolean
	children?: React.ReactNode

	// Positioning - Floating UI
	placement?: import('@floating-ui/react').Placement
	strategy?: import('@floating-ui/react').Strategy
	offset?: number | { x?: number; y?: number }
	referenceElement?: Element | null

	// Draggable
	draggable?: boolean
	initialPosition?: { x: number; y: number }
	constrainToViewport?: boolean
	snapToEdges?: boolean
	snapThreshold?: number

	// Behavior
	modal?: boolean
	closeOnEscape?: boolean
	closeOnOutsideClick?: boolean

	// Styling
	className?: string
}

export interface ContentProps extends React.ComponentPropsWithoutRef<'div'> {
	size?: WidgetSize
	header?: WidgetHeaderProps
	footer?: WidgetFooterProps
}

export function Root({
	open: openProp,
	onOpenChange,
	defaultOpen = false,
	children,
	placement = 'bottom',
	strategy = 'absolute',
	offset: offsetValue = 10,
	referenceElement,
	draggable = false,
	initialPosition = { x: 100, y: 100 },
	constrainToViewport = true,
	snapToEdges = false,
	snapThreshold = 20,
	modal = false,
	closeOnEscape = true,
	closeOnOutsideClick = true,
	className,
}: WidgetProps) {
	const [isOpen, setIsOpen] = useControllableState({
		prop: openProp,
		defaultProp: defaultOpen,
		onChange: onOpenChange,
	})

	// Drag functionality for draggable widgets
	const dragHook = useDrag({
		initialPosition,
		constrainToViewport,
		snapToEdges,
		snapThreshold,
	})

	// Floating UI setup for positioned widgets (only when referenceElement is provided)
	const { refs, floatingStyles, context } = useFloating({
		open: isOpen && !draggable && !modal && !!referenceElement,
		onOpenChange: setIsOpen,
		placement,
		strategy,
		elements: {
			reference: referenceElement,
		},
		middleware: [
			offset(
				typeof offsetValue === 'number'
					? offsetValue
					: {
							mainAxis: offsetValue?.y || 0,
							crossAxis: offsetValue?.x || 0,
						}
			),
			flip({
				fallbackAxisSideDirection: 'end',
			}),
			shift({ padding: 8 }),
		],
		whileElementsMounted: autoUpdate,
	})

	const click = useClick(context, {
		enabled: !!referenceElement && !draggable,
	})

	const dismiss = useDismiss(context, {
		enabled: (closeOnOutsideClick || closeOnEscape) && !draggable,
		escapeKey: false, // We handle escape key globally for all widget types
		outsidePress: closeOnOutsideClick,
	})

	const role = useRole(context)

	const { getReferenceProps, getFloatingProps } = useInteractions([
		click,
		dismiss,
		role,
	])

	const headingId = useId()

	// Handle escape key for all widgets when closeOnEscape is enabled
	React.useEffect(() => {
		if (!closeOnEscape || !isOpen) return

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				setIsOpen(false)
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [closeOnEscape, isOpen, setIsOpen])

	const contextValue = React.useMemo(
		() => ({
			isOpen: isOpen ?? false,
			setIsOpen: (open: boolean) => setIsOpen(open),
			draggable,
			dragHook,
			headingId: headingId || '',
			modal,
			closeOnEscape,
			closeOnOutsideClick,
		}),
		[
			isOpen,
			setIsOpen,
			draggable,
			dragHook,
			headingId,
			modal,
			closeOnEscape,
			closeOnOutsideClick,
		]
	)

	// Render for Floating UI positioned widgets (with referenceElement)
	if (!draggable && !modal && referenceElement) {
		return (
			<WidgetContext.Provider value={contextValue}>
				{isOpen && (
					<FloatingPortal>
						<FloatingFocusManager context={context} modal={false}>
							<div
								ref={refs.setFloating}
								style={floatingStyles}
								{...getFloatingProps()}
								aria-labelledby={headingId}
								className={className}
							>
								{children}
							</div>
						</FloatingFocusManager>
					</FloatingPortal>
				)}
			</WidgetContext.Provider>
		)
	}

	// Render for simple positioned widgets (without referenceElement)
	if (!draggable && !modal && !referenceElement) {
		const getPositionFromPlacement = () => {
			const offset = typeof offsetValue === 'number' ? offsetValue : 10

			switch (placement) {
				case 'top':
				case 'top-start':
				case 'top-end':
					return { top: offset, left: '50%', transform: 'translateX(-50%)' }
				case 'bottom':
				case 'bottom-start':
				case 'bottom-end':
					return { bottom: offset, left: '50%', transform: 'translateX(-50%)' }
				case 'left':
				case 'left-start':
				case 'left-end':
					return { left: offset, top: '50%', transform: 'translateY(-50%)' }
				case 'right':
				case 'right-start':
				case 'right-end':
					return { right: offset, top: '50%', transform: 'translateY(-50%)' }
				default:
					return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
			}
		}

		return (
			<WidgetContext.Provider value={contextValue}>
				{isOpen && (
					<div
						style={{
							position: 'fixed',
							zIndex: 50,
							...getPositionFromPlacement(),
						}}
						aria-labelledby={headingId}
						className={className}
					>
						{children}
					</div>
				)}
			</WidgetContext.Provider>
		)
	}

	// Render for modal widgets
	if (modal) {
		return (
			<WidgetContext.Provider value={contextValue}>
				{isOpen && (
					<FloatingPortal>
						<div
							className="widget-overlay"
							data-widget-overlay=""
							data-state="open"
							style={{
								position: 'fixed',
								inset: 0,
								zIndex: 50,
								backgroundColor: 'rgba(0, 0, 0, 0.5)',
								backdropFilter: 'blur(4px)',
							}}
							onClick={e => {
								if (closeOnOutsideClick && e.target === e.currentTarget) {
									setIsOpen(false)
								}
							}}
						/>
						<FloatingFocusManager context={context} modal={true}>
							<div
								style={{
									position: 'fixed',
									left: '50%',
									top: '50%',
									transform: 'translate(-50%, -50%)',
									zIndex: 51,
								}}
								aria-labelledby={headingId}
								className={className}
							>
								{children}
							</div>
						</FloatingFocusManager>
					</FloatingPortal>
				)}
			</WidgetContext.Provider>
		)
	}

	// Render for draggable widgets
	return (
		<WidgetContext.Provider value={contextValue}>
			{isOpen && (
				<div
					ref={dragHook.elementRef}
					style={{
						position: 'fixed',
						left: dragHook.position.x,
						top: dragHook.position.y,
						zIndex: 50,
					}}
					aria-labelledby={headingId}
					className={className}
					onPointerDown={dragHook.handleMouseDown}
				>
					{children}
				</div>
			)}
		</WidgetContext.Provider>
	)
}

// Context for passing data to child components
const WidgetContext = React.createContext<{
	isOpen: boolean
	setIsOpen: (open: boolean) => void
	draggable: boolean
	dragHook: any
	headingId: string
	modal: boolean
	closeOnEscape: boolean
	closeOnOutsideClick: boolean
} | null>(null)

function useWidgetContext() {
	const context = React.useContext(WidgetContext)
	if (!context) {
		throw new Error('Widget components must be used within Widget.Root')
	}
	return context
}

export const Content = React.forwardRef<HTMLDivElement, ContentProps>(
	function Content(
		{ className, size, header, footer, children, ...rest },
		ref
	) {
		const containerStyle: React.CSSProperties = {
			...(size && {
				width: size.width,
				height: size.height,
				minWidth: size.minWidth,
				minHeight: size.minHeight,
				maxWidth: size.maxWidth,
				maxHeight: size.maxHeight,
			}),
		}

		return (
			<div
				ref={ref}
				data-widget=""
				data-state="open"
				className={`widget ${className || ''}`}
				style={containerStyle}
				{...rest}
			>
				{header && <Header {...header} />}
				<div
					className={
						header || footer
							? 'widget-content'
							: 'widget-content widget-content-padded'
					}
				>
					{children}
				</div>
				{footer && <Footer {...footer} />}
			</div>
		)
	}
)

Content.displayName = 'Widget.Content'

export const Header = React.forwardRef<
	HTMLDivElement,
	WidgetHeaderProps & { headingId?: string }
>(function Header(
	{ title, subtitle, className, showCloseButton = true, closeButton, ...rest },
	ref
) {
	const { headingId, draggable } = useWidgetContext()

	return (
		<div
			ref={ref}
			className={`widget-header ${draggable ? 'cursor-grab active:cursor-grabbing' : ''} ${className || ''}`}
			{...rest}
		>
			<div className="widget-header-content">
				{title && (
					<h2 id={headingId} className="widget-title">
						{title}
					</h2>
				)}
				{subtitle && <p className="widget-subtitle">{subtitle}</p>}
			</div>
			{showCloseButton && <CloseButton {...closeButton} />}
		</div>
	)
})

Header.displayName = 'Widget.Header'

export const CloseButton = React.forwardRef<
	HTMLButtonElement,
	CloseButtonProps
>(function CloseButton({ disabled, custom, onClick, className, ...rest }, ref) {
	const { setIsOpen } = useWidgetContext()

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation() // Prevent triggering drag
		onClick?.(e)
		if (!e.defaultPrevented) {
			setIsOpen(false)
		}
	}

	if (custom) {
		return (
			<button
				ref={ref}
				type="button"
				disabled={disabled}
				onClick={handleClick}
				className={`widget-close-button ${className || ''}`}
				aria-label="Close widget"
				{...rest}
			>
				{custom}
			</button>
		)
	}

	return (
		<button
			ref={ref}
			type="button"
			disabled={disabled}
			onClick={handleClick}
			className={`widget-close-button ${className || ''}`}
			aria-label="Close widget"
			{...rest}
		>
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<line x1="18" y1="6" x2="6" y2="18" />
				<line x1="6" y1="6" x2="18" y2="18" />
			</svg>
		</button>
	)
})

CloseButton.displayName = 'Widget.CloseButton'

export const Footer = React.forwardRef<HTMLDivElement, WidgetFooterProps>(
	function Footer({ children, className, padding = true, ...rest }, ref) {
		return (
			<div
				ref={ref}
				className={
					padding
						? `widget-footer widget-footer-padded ${className || ''}`
						: `widget-footer ${className || ''}`
				}
				{...rest}
			>
				{children}
			</div>
		)
	}
)

Footer.displayName = 'Widget.Footer'

export const Widget = {
	Root,
	Content,
	Header,
	Footer,
	CloseButton,
}

// Export types
export type {
	Position,
	DragState,
	WidgetSize,
	CloseButtonProps,
	WidgetHeaderProps,
	WidgetFooterProps,
}
