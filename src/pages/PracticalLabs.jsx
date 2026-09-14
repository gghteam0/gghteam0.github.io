import { ExternalLink, Github } from 'lucide-react'
import { SectionHead, Icon, Corners } from '../components/ui.jsx'
import { labs } from '../data/contentData.js'

const tips = [
  'ابدأ بالغرف السهلة في TryHackMe لبناء أساس قوي .',
  'انتقل إلى Hack The Box بعد إتقان الأساسيات للتحديات المتقدمة .',
  'استخدم PortSwigger لإتقان اختراق تطبيقات الويب .',
  'وثّق كل ما تتعلمه — الملاحظات هي أفضل مرجع لك .',
]

export default function PracticalLabs() {
  return (
    <div className="min-h-screen">
      <section className="pt-24 pb-16 relative">
        <div className="absolute inset-0 bg-cyber-grid bg-cyber-grid opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-display text-white glow-green mb-6">التطبيق العملي</h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              أسرع طريقة لتعلم الأمن السيبراني و تدريب نفسك على التطبيق العملي هي ال CTF .
            </p>
            <p className="text-secondary text-lg font-semibold">أنصح بالبداية مع منصة TryHackMe</p>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <a href="https://github.com/uttambodara/TryHackMeRoadmap" target="_blank" rel="noopener noreferrer" className="cyber-card group cursor-pointer block border-2 border-primary/50 hover:border-primary transition-all">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-primary/20 text-primary group-hover:bg-primary/30 transition-colors group-hover:shadow-[0_0_20px_hsl(var(--neon-green)/0.5)]">
                    <Github className="w-10 h-10" />
                  </div>
                  <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 glow-green transition-all font-mono-en">TryHackMe Free Roadmap</h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  خريطة طريق شاملة للمبتدئين و المتوسطين .
                </p>
              </div>
            </a>
            <a href="https://github.com/winterrdog/tryhackme-free-rooms" target="_blank" rel="noopener noreferrer" className="cyber-card group cursor-pointer block border-2 border-secondary/50 hover:border-secondary transition-all">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-secondary/20 text-secondary group-hover:bg-secondary/30 transition-colors group-hover:shadow-[0_0_20px_hsl(var(--neon-purple)/0.5)]">
                    <Github className="w-10 h-10" />
                  </div>
                  <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 glow-green transition-all font-mono-en">TryHackMe Free Rooms</h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  خريطة طريق شاملة للمبتدئين و المتوسطين و المتقدمين .
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHead title="منصات التدريب العملية" subtitle="اختر المنصة المناسبة لمستواك و ابدأ التدريب العملي ." glowColor="green" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {labs.map((l, i) => (
              <a
                key={l.name}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`cyber-card group cursor-pointer opacity-0 animate-fade-in-up${i === labs.length - 1 && labs.length % 3 === 1 ? ' lg:col-start-2' : ''}`}
                style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'forwards' }}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg transition-colors" style={{ backgroundColor: `${l.color}1A`, color: l.color }}>
                      <Icon name={l.icon} className={`w-8 h-8 ${l.glyph || 'text-primary'}`} />
                    </div>
                    <ExternalLink className="w-4 h-4 transition-colors opacity-60 group-hover:opacity-100" style={{ color: l.color }} />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 transition-all font-mono-en ${l.glyph || 'text-primary group-hover:glow-green'}`}>{l.name}</h3>
                  <p className="text-muted-foreground text-sm">{l.description}</p>
                </div>
                <Corners hex={l.color} />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="cyber-card">
              <div className="relative z-10">
                <h3 className="text-xl font-bold font-display text-white glow-green mb-4">💡 نصائح للتدريب العملي</h3>
                <ul className="space-y-3 text-muted-foreground">
                  {tips.map((t) => (
                    <li key={t} className="flex items-start gap-3">
                      <span className="text-secondary">←</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
