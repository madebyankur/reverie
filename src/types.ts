import { ReactNode, MouseEvent } from 'react'

export interface Position {
	x: number
	y: number
}

export interface DragState {
	isDragging: boolean
	dragOffset: Position
	startPosition: Position
	currentPosition: Position
}

export interface WidgetSize {
	width?: number | string
	height?: number | string
	minWidth?: number | string
	minHeight?: number | string
	maxWidth?: number | string
	maxHeight?: number | string
}

export interface CloseButtonProps {
	disabled?: boolean
	custom?: ReactNode
	onClick?: (event: MouseEvent<HTMLButtonElement>) => void
	className?: string
}

export interface WidgetHeaderProps {
	title?: ReactNode
	subtitle?: ReactNode
	className?: string
	showCloseButton?: boolean
	closeButton?: CloseButtonProps
}

export interface WidgetFooterProps {
	children?: ReactNode
	className?: string
	padding?: boolean
}

export type AnyFunction = (...args: any[]) => any
