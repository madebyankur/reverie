# React Widget

A beautiful, draggable widget component for React that can be positioned anywhere on the page, used as a modal, or kept static. Perfect for notifications, help dialogs, tools, and more.

## Features

- 🎯 **Draggable & Positionable** - Drag widgets around the screen with smooth interactions
- 🎭 **Modal & Overlay Support** - Use as traditional modals with backdrop blur
- 🎨 **Highly Customizable** - Custom close buttons, headers, footers, and styling
- ⌨️ **Keyboard Accessible** - Full keyboard support including Escape to close
- 📱 **Responsive** - Works great on desktop, tablet, and mobile
- 🎪 **Snap to Edges** - Optional snapping behavior for better UX
- 🎬 **Smooth Animations** - Beautiful enter/exit animations powered by Framer Motion
- 🔧 **TypeScript Ready** - Full TypeScript support with comprehensive types
- 🎪 **Framework Agnostic** - Works with any React setup (Next.js, Vite, CRA, etc.)

## Installation

```bash
npm install @widget/react-widget
```

## Quick Start

```tsx
import React, { useState } from 'react'
import { Widget } from '@widget/react-widget'

function App() {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<div>
			<button onClick={() => setIsOpen(true)}>Open Widget</button>

			<Widget
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				header={{
					title: 'Hello World!',
					subtitle: 'This is a beautiful widget',
				}}
				content={{
					children: (
						<div>
							<p>Your content goes here!</p>
						</div>
					),
				}}
			/>
		</div>
	)
}
```

## Examples

### Basic Widget

```tsx
<Widget
	isOpen={true}
	header={{
		title: 'Welcome!',
		subtitle: 'This is a simple widget',
	}}
	content={{
		children: <p>Simple content here</p>,
	}}
/>
```

### Draggable Widget

```tsx
<Widget
	isOpen={true}
	draggable={true}
	initialPosition={{ x: 100, y: 100 }}
	snapToEdges={true}
	header={{
		title: 'Drag me around!',
	}}
	content={{
		children: <p>This widget can be dragged around the screen.</p>,
	}}
/>
```

### Modal Widget

```tsx
<Widget
	isOpen={true}
	modal={true}
	blur={true}
	closeOnOutsideClick={true}
	closeOnEscape={true}
	header={{
		title: 'Modal Widget',
	}}
	content={{
		children: <p>I appear as a modal with backdrop blur!</p>,
	}}
	footer={{
		children: <button onClick={onClose}>Close</button>,
	}}
/>
```

### Custom Close Button

```tsx
<Widget
	isOpen={true}
	header={{
		title: 'Custom Close',
		closeButton: {
			custom: <MyCustomIcon />,
			className: 'text-red-500 hover:text-red-700',
			onClick: e => {
				console.log('Custom close logic')
				onClose()
			},
		},
	}}
	content={{
		children: <p>Custom close button example</p>,
	}}
/>
```

## API Reference

### Widget Props

| Prop                  | Type                     | Default            | Description                               |
| --------------------- | ------------------------ | ------------------ | ----------------------------------------- |
| `isOpen`              | `boolean`                | -                  | **Required.** Controls widget visibility  |
| `onClose`             | `() => void`             | -                  | Callback when widget should close         |
| `draggable`           | `boolean`                | `false`            | Enable drag functionality                 |
| `initialPosition`     | `{x: number, y: number}` | `{x: 100, y: 100}` | Initial position for draggable widgets    |
| `constrainToViewport` | `boolean`                | `true`             | Keep widget within viewport bounds        |
| `snapToEdges`         | `boolean`                | `false`            | Snap to viewport edges when close         |
| `snapThreshold`       | `number`                 | `20`               | Distance threshold for edge snapping      |
| `modal`               | `boolean`                | `false`            | Render as modal with backdrop             |
| `blur`                | `boolean`                | `false`            | Add backdrop blur effect (modal only)     |
| `closeOnEscape`       | `boolean`                | `true`             | Close on Escape key press                 |
| `closeOnOutsideClick` | `boolean`                | `false`            | Close when clicking backdrop (modal only) |
| `animation`           | `boolean`                | `true`             | Enable enter/exit animations              |
| `animationDuration`   | `number`                 | `300`              | Animation duration in milliseconds        |

### Header Props

```tsx
header?: {
	title?: ReactNode
	subtitle?: ReactNode
	className?: string
	showCloseButton?: boolean
	closeButton?: {
		disabled?: boolean
		custom?: ReactNode
		onClick?: (event: MouseEvent<HTMLButtonElement>) => void
		className?: string
	}
}
```

### Content Props

```tsx
content: {
	children: ReactNode
	className?: string
	padding?: boolean // default: true
}
```

### Footer Props

```tsx
footer?: {
	children?: ReactNode
	className?: string
	padding?: boolean // default: true
}
```

### Size Props

```tsx
size?: {
	width?: number | string
	height?: number | string
	minWidth?: number | string
	minHeight?: number | string
	maxWidth?: number | string
	maxHeight?: number | string
}
```

## Styling

The component uses Tailwind CSS for styling. You can customize the appearance by:

1. **Using className props** - Pass custom classes to override styles
2. **CSS custom properties** - Define CSS variables for theme colors
3. **Tailwind configuration** - Extend the default theme

### Custom Styling Example

```tsx
<Widget
	isOpen={true}
	className="bg-blue-50 border-blue-200"
	header={{
		title: 'Custom Styled Widget',
		className: 'bg-blue-100 text-blue-900',
	}}
	content={{
		children: <p>Custom styled content</p>,
		className: 'text-blue-800',
	}}
	footer={{
		children: <button>Action</button>,
		className: 'bg-blue-50',
	}}
/>
```

## Development

### Setup

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Run demo
npm run demo

# Build package
npm run build

# Type check
npm run typecheck

# Lint
npm run lint

# Format code
npm run format
```

### Project Structure

```
src/
├── components/
│   └── widget.tsx       # Main Widget component
├── hooks/
│   └── use-drag.ts      # Drag functionality hook
├── types.ts             # TypeScript definitions
├── styles.css           # Component styles
└── index.ts             # Package exports

demo/
├── src/
│   ├── App.tsx          # Demo application
│   ├── main.tsx         # Demo entry point
│   └── index.css        # Demo styles
├── index.html           # Demo HTML
└── vite.config.ts       # Vite configuration
```

## Browser Support

- Chrome 88+
- Firefox 78+
- Safari 14+
- Edge 88+

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © Widget Team
# reverie
