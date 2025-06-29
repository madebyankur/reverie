import React, { useState, useRef } from 'react'
import { Widget } from '../../src'

const HeartIcon = () => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="currentColor"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
	</svg>
)

export default function App() {
	const [simpleOpen, setSimpleOpen] = useState(false)
	const [draggableOpen, setDraggableOpen] = useState(false)
	const [modalOpen, setModalOpen] = useState(false)
	const [customOpen, setCustomOpen] = useState(false)
	const [positionedOpen, setPositionedOpen] = useState(false)

	const simpleButtonRef = useRef<HTMLButtonElement>(null)
	const customButtonRef = useRef<HTMLButtonElement>(null)
	const positionedButtonRef = useRef<HTMLButtonElement>(null)

	return (
		<div className="min-h-screen p-8">
			<div className="max-w-4xl mx-auto">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-white mb-4">
						React Widget Demo
					</h1>
					<p className="text-xl text-white/80">
						A beautiful widget component powered by Floating UI
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="demo-card rounded-xl p-6 text-white">
						<h3 className="text-xl font-semibold mb-2">Simple Widget</h3>
						<p className="text-white/80 mb-4">
							A basic widget with viewport-based positioning
						</p>
						<button
							ref={simpleButtonRef}
							onClick={() => setSimpleOpen(true)}
							className="demo-button px-4 py-2 rounded-lg text-white font-medium"
						>
							Open Widget
						</button>
					</div>

					<div className="demo-card rounded-xl p-6 text-white">
						<h3 className="text-xl font-semibold mb-2">Draggable Widget</h3>
						<p className="text-white/80 mb-4">
							A widget you can drag around the screen
						</p>
						<button
							onClick={() => setDraggableOpen(true)}
							className="demo-button px-4 py-2 rounded-lg text-white font-medium"
						>
							Open Widget
						</button>
					</div>

					<div className="demo-card rounded-xl p-6 text-white">
						<h3 className="text-xl font-semibold mb-2">Modal Widget</h3>
						<p className="text-white/80 mb-4">
							A widget that appears as a modal overlay
						</p>
						<button
							onClick={() => setModalOpen(true)}
							className="demo-button px-4 py-2 rounded-lg text-white font-medium"
						>
							Open Widget
						</button>
					</div>

					<div className="demo-card rounded-xl p-6 text-white">
						<h3 className="text-xl font-semibold mb-2">Custom Close Button</h3>
						<p className="text-white/80 mb-4">
							Widget with a custom close button
						</p>
						<button
							ref={customButtonRef}
							onClick={() => setCustomOpen(true)}
							className="demo-button px-4 py-2 rounded-lg text-white font-medium"
						>
							Open Widget
						</button>
					</div>

					<div className="demo-card rounded-xl p-6 text-white">
						<h3 className="text-xl font-semibold mb-2">
							Reference-Based Widget
						</h3>
						<p className="text-white/80 mb-4">
							A widget positioned relative to a specific reference element
						</p>
						<button
							ref={positionedButtonRef}
							onClick={() => setPositionedOpen(true)}
							className="demo-button px-4 py-2 rounded-lg text-white font-medium"
						>
							Open Positioned Widget
						</button>
					</div>
				</div>

				<div className="mt-12 demo-card rounded-xl p-6 text-white">
					<h3 className="text-xl font-semibold mb-4">Features</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<span className="text-green-400">✓</span>
								<span>Draggable & Moveable</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-green-400">✓</span>
								<span>Floating UI Positioning</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-green-400">✓</span>
								<span>Modal & Overlay Support</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-green-400">✓</span>
								<span>Custom Close Buttons</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-green-400">✓</span>
								<span>Smart Collision Detection</span>
							</div>
						</div>
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<span className="text-green-400">✓</span>
								<span>Auto-flipping</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-green-400">✓</span>
								<span>TypeScript Support</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-green-400">✓</span>
								<span>Focus Management</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-green-400">✓</span>
								<span>Keyboard Support</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-green-400">✓</span>
								<span>Accessible ARIA</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Simple Widget - positioned on page by default */}
			<Widget.Root
				open={simpleOpen}
				onOpenChange={setSimpleOpen}
				placement="bottom"
				closeOnEscape
			>
				<Widget.Content
					header={{
						title: 'Welcome!',
						subtitle: 'This is a simple widget',
						closeButton: {
							onClick: () => setSimpleOpen(false),
						},
					}}
					className="widget"
				>
					<div className="space-y-4">
						<p className="text-gray-600">
							This is a basic widget example. It has a header with title and
							subtitle, and this content area.
						</p>
						<p className="text-sm text-gray-500">
							Positioned as a fixed viewport overlay using virtual reference!
						</p>
					</div>
				</Widget.Content>
			</Widget.Root>

			{/* Draggable Widget */}
			<Widget.Root
				open={draggableOpen}
				onOpenChange={setDraggableOpen}
				draggable={true}
				initialPosition={{ x: 200, y: 150 }}
				snapToEdges={true}
				closeOnEscape
			>
				<Widget.Content
					header={{
						title: '🚀 Draggable Widget',
						subtitle: 'Drag me around!',
						closeButton: {
							onClick: () => setDraggableOpen(false),
						},
					}}
					className="widget"
				>
					<div className="space-y-3">
						<p className="text-gray-600">
							This widget can be dragged around the screen. Try grabbing the
							header and moving it!
						</p>
						<div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
							<span className="text-blue-600">💡</span>
							<span className="text-sm text-blue-700">
								Snapping to edges is enabled
							</span>
						</div>
					</div>
				</Widget.Content>
			</Widget.Root>

			{/* Modal Widget */}
			<Widget.Root open={modalOpen} onOpenChange={setModalOpen} modal={true}>
				<Widget.Content
					header={{
						title: 'Modal Widget',
						subtitle: 'I appear on top of everything',
						closeButton: {
							onClick: () => setModalOpen(false),
						},
					}}
					footer={{
						children: (
							<div className="flex justify-end">
								<button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
									Action Button
								</button>
							</div>
						),
					}}
					className="widget"
				>
					<div className="space-y-4">
						<p className="text-gray-600">
							This widget appears as a modal overlay. It has a blurred
							background and can be closed by clicking outside or pressing
							Escape.
						</p>
						<div className="grid grid-cols-2 gap-4">
							<div className="p-3 bg-green-50 rounded-lg text-center">
								<div className="text-green-600 text-lg font-semibold">✓</div>
								<div className="text-sm text-green-700">Click outside</div>
							</div>
							<div className="p-3 bg-purple-50 rounded-lg text-center">
								<div className="text-purple-600 text-lg font-semibold">⌨️</div>
								<div className="text-sm text-purple-700">Press Escape</div>
							</div>
						</div>
					</div>
				</Widget.Content>
			</Widget.Root>

			{/* Custom Close Button Widget */}
			<Widget.Root
				open={customOpen}
				onOpenChange={setCustomOpen}
				referenceElement={customButtonRef.current}
				placement="top"
			>
				<Widget.Content
					header={{
						title: 'Custom Close',
						subtitle: 'Look at my fancy close button!',
						closeButton: {
							custom: <HeartIcon />,
							className: 'text-red-500 hover:text-red-700',
							onClick: () => setCustomOpen(false),
						},
					}}
					className="widget"
				>
					<div className="space-y-3">
						<p className="text-gray-600">
							This widget has a custom close button with a heart icon instead of
							the usual X.
						</p>
						<div className="p-3 bg-red-50 rounded-lg">
							<p className="text-sm text-red-700">
								💕 The close button shows a heart instead of an X!
							</p>
						</div>
					</div>
				</Widget.Content>
			</Widget.Root>

			{/* Positioned Widget */}
			<Widget.Root
				open={positionedOpen}
				onOpenChange={setPositionedOpen}
				placement="bottom"
				offset={20}
				referenceElement={positionedButtonRef.current}
			>
				<Widget.Content
					header={{
						title: '📍 Floating UI Widget',
						subtitle: 'Positioned with Floating UI',
						closeButton: {
							onClick: () => setPositionedOpen(false),
						},
					}}
					className="widget"
				>
					<div className="space-y-3">
						<p className="text-gray-600">
							This widget uses Floating UI for smart positioning! It's
							positioned relative to the button that opened it.
						</p>
						<div className="p-3 bg-orange-50 rounded-lg">
							<p className="text-sm text-orange-700">
								🎯 Features collision detection, auto-flipping, and smart
								positioning
							</p>
						</div>
					</div>
				</Widget.Content>
			</Widget.Root>
		</div>
	)
}
