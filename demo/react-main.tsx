import React from 'react'
import { createRoot } from 'react-dom/client'
import '../src/core/styles/tailwind.css'
import ReactApp from './ReactApp'

createRoot(document.getElementById('root')!).render(
  React.createElement(ReactApp),
)
