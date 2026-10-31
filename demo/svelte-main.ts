import { mount } from 'svelte'
import '../src/core/styles/tailwind.css'
import SvelteApp from './SvelteApp.svelte'

mount(SvelteApp, { target: document.getElementById('app')! })
