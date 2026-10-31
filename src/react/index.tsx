import React from 'react'

export interface TooltipProps {
  text: string
  children?: React.ReactNode
}

export function Tooltip({ text, children }: TooltipProps) {
  return React.createElement('span', { title: text }, children)
}

export default Tooltip
