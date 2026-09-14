import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const links = [
  { path: '/', label: 'الرئيسية' },
  { path: '/roadmap', label: 'خريطة الطريق' },
  { path: '/practical-labs', label: 'التطبيق العملي' },
  { path: '/tools', label: 'مكتبة الأدوات' },
  { path: '/about', label: 'حول' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const ref = useRef(null)
  const isActive = (p) => pathname === p || (p !== '/' && pathname.startsWith(p + '/'))

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <nav ref={ref} className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="logo.png" alt="GGH Team" className="h-12 w-auto rounded object-cover mix-blend-screen transition-all duration-300 group-hover:drop-shadow-[0_0_10px_hsl(var(--neon-green))]" />
            <span dir="ltr" className="font-display text-lg font-bold text-white">
              GGH Team
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className={`px-4 py-2 text-sm font-medium tracking-wider transition-all duration-300 relative group ${isActive(l.path) ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              >
                <span className="relative z-10">{l.label}</span>
                <span className={`absolute inset-0 bg-primary/10 rounded transition-all duration-300 ${isActive(l.path) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                {isActive(l.path) && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary shadow-[0_0_10px_hsl(var(--neon-green))]" />}
              </Link>
            ))}
          </div>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-primary hover:bg-primary/10 rounded transition-colors" aria-label="القائمة">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {open && (
          <div className="md:hidden py-4 border-t border-primary/20 animate-fade-in-up">
            {links.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 text-sm font-medium tracking-wider transition-all duration-300 ${isActive(l.path) ? 'text-primary bg-primary/10 border-r-2 border-primary' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'}`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
