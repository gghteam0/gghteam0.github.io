import { useEffect, useRef } from 'react'

export default function MatrixCanvas() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const fit = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    fit()
    window.addEventListener('resize', fit)
    const chars = 'アカサタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]|/\\!@#$%^&*()'.split('')
    const size = 14
    let cols = Math.floor(canvas.width / size)
    let drops = Array(cols).fill(1)
    const speeds = Array.from({ length: cols }, () => 0.15 + Math.random() * 0.25)
    const id = setInterval(() => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${size}px JetBrains Mono`
      for (let i = 0; i < drops.length; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)]
        const x = i * size
        const y = drops[i] * size
        if (Math.random() > 0.98) {
          ctx.shadowBlur = 20
          ctx.shadowColor = '#3dc2ff'
        } else {
          ctx.shadowBlur = 0
        }
        const a = Math.random() * 0.5 + 0.5
        ctx.fillStyle = `rgba(61, 194, 255, ${a})`
        ctx.fillText(ch, x, y)
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i] += speeds[i]
      }
    }, 50)
    return () => {
      clearInterval(id)
      window.removeEventListener('resize', fit)
    }
  }, [])

  return <canvas ref={ref} className="fixed inset-0 z-0 pointer-events-none opacity-30" />
}
