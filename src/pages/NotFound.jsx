import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function NotFound() {
  const loc = useLocation()
  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', loc.pathname)
  }, [loc.pathname])
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold font-display text-white glow-green">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">عذراً! الصفحة غير موجودة</p>
        <Link to="/" className="cyber-btn inline-block">العودة للرئيسية</Link>
      </div>
    </div>
  )
}
