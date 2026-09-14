import { Link } from 'react-router-dom'
import { Shield, Users, Gift, ArrowLeft } from 'lucide-react'
import { Disclaimer } from '../components/ui.jsx'

const features = [
  { icon: Shield, title: 'تسهيل الأمن السيبراني', description: 'كل ما تحتاجه لتعلم الأمن السيبراني' },
  { icon: Users, title: 'دعم مجتمعنا', description: 'بهذا ستستفيد من المصادر و تصل لها بكل سهولة بطريقة واضحة و منظمة و بنفس الوقت تدعم صناع هذا المحتوى ممن اجتهدوا عليه' },
  { icon: Gift, title: 'مصادر مجانية', description: 'الأمن السيبراني ليس حكراً على أحد و هدفنا نوصلك للمصادر المتاحة على الانترنت بشكل مجاني' },
]

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <div className="absolute inset-0 bg-cyber-grid bg-cyber-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-background/50 to-background" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-muted/30 backdrop-blur-sm mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <code dir="ltr" className="text-sm text-muted-foreground font-mono-en">
              system.init(<span className="text-primary">"GGH_Team"</span>)
            </code>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="text-white glow-green">ابدأ رحلتك</span>
            <br />
            <span className="text-white glow-green">في </span>
            <span className="text-white glow-green">الأمن السيبراني</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            هدفنا تسهيل الأمن السيبراني و توفير المصادر المتاحة للجميع
            <span className="terminal-cursor" />
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/roadmap" className="cyber-btn text-base group">
              <span className="flex items-center gap-2">
                ابدأ التعلم
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </span>
            </Link>
            <Link to="/about" className="px-6 py-3 text-muted-foreground hover:text-primary transition-colors text-base">
              ← حول الموقع
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              لماذا <span className="text-white glow-green"><span dir="ltr">GGH Team</span> ؟</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">كل ما تحتاجه لبناء مسيرة مهنية في الأمن السيبراني .</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <div key={f.title} className="cyber-card text-center" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="relative z-10">
                  <div className="inline-flex p-4 rounded-lg bg-primary/10 text-primary mb-6 group-hover:bg-primary/20 transition-colors">
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                  <p className="text-muted-foreground text-sm">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Disclaimer />
    </div>
  )
}
