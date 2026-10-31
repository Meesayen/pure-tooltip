import React, { useState } from 'react'
import { Tooltip } from '../src/react'

type Position = 'top' | 'bottom' | 'left' | 'right'

const hoverPoints = [
  { label: 'TL', className: 'fixed top-4 left-4 z-40' },
  { label: 'TR', className: 'fixed top-4 right-4 z-40' },
  { label: 'BL', className: 'fixed bottom-4 left-4 z-40' },
  { label: 'BR', className: 'fixed bottom-4 right-4 z-40' },
  { label: 'T', className: 'fixed top-4 left-1/2 z-40 -translate-x-1/2' },
  { label: 'B', className: 'fixed bottom-4 left-1/2 z-40 -translate-x-1/2' },
  { label: 'L', className: 'fixed top-1/2 left-4 z-40 -translate-y-1/2' },
  { label: 'R', className: 'fixed top-1/2 right-4 z-40 -translate-y-1/2' },
]

const staticConfigs: { text: string; position: Position }[] = [
  { text: 'Tooltip on top', position: 'top' },
  { text: 'Tooltip on bottom', position: 'bottom' },
  { text: 'Tooltip on left', position: 'left' },
  { text: 'Tooltip on right', position: 'right' },
]

export default function ReactApp() {
  const [position, setPosition] = useState<Position>('bottom')
  const [text, setText] = useState('Configurable tooltip')

  const dynamicValue = { text, position }

  return (
    <>
      {hoverPoints.map(point => (
        <div key={point.label} className={point.className}>
          <Tooltip value={dynamicValue}>
            <button className="h-10 w-10 rounded bg-gray-800 text-xs text-white">
              {point.label}
            </button>
          </Tooltip>
        </div>
      ))}

      <section className="flex min-h-screen items-center justify-center px-4 py-24">
        <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
          <h1 className="mb-4 text-xl font-bold">React Demo</h1>

          <p className="mb-4 text-sm text-gray-600">
            This tooltip auto-repositions based on the available space around
            its trigger. Hover over the buttons at the corners and edges of the
            viewport to see how it moves to stay fully visible.
          </p>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Position</label>
            <select
              value={position}
              onChange={e => setPosition(e.target.value as Position)}
              className="w-full rounded border border-gray-300 px-3 py-2"
            >
              <option value="top">top</option>
              <option value="bottom">bottom</option>
              <option value="left">left</option>
              <option value="right">right</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium">Text</label>
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              type="text"
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>

          <p className="mb-3 text-sm text-gray-600">
            The fixed hover triggers across the viewport use the configuration
            above.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {staticConfigs.map(cfg => (
              <Tooltip key={cfg.position} value={cfg}>
                <button className="rounded bg-blue-600 px-3 py-2 text-sm text-white w-full">
                  {cfg.position}
                </button>
              </Tooltip>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
