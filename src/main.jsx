import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// GitHub Pages caches HTML for 10 minutes while bundles are content-hashed, so a
// refresh can boot an older bundle than the one now deployed. Compare the running
// bundle against the one referenced by the live HTML and reload once if they differ.
const STALE_KEY = 'ggh_stale_reload'

function runningBundle() {
  const el = document.querySelector('script[type="module"][src]')
  return el ? el.src.split('/').pop() : null
}

async function refreshIfStale() {
  try {
    const res = await fetch('/?_stale=' + Date.now(), { cache: 'no-store' })
    const html = await res.text()
    const match = html.match(/assets\/(index-[A-Za-z0-9_-]+\.js)/)
    const mine = runningBundle()
    if (!match || !mine) return
    if (match[1] === mine) {
      sessionStorage.removeItem(STALE_KEY)
      return
    }
    if (sessionStorage.getItem(STALE_KEY)) return
    sessionStorage.setItem(STALE_KEY, '1')
    window.location.reload()
  } catch {
    // offline or blocked: keep the current build rather than loop
  }
}

setTimeout(refreshIfStale, 1500)
