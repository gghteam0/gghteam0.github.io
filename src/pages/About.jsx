import { Heart, ShieldCheck, Instagram, Youtube } from 'lucide-react'
import { XLogo, TikTokLogo, TelegramLogo, SubstackLogo } from '../components/ui.jsx'

export default function About() {
  return (
    <div className="min-h-screen">
      <section className="pt-24 pb-16 relative">
        <div className="absolute inset-0 bg-cyber-grid bg-cyber-grid opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-display text-white glow-green mb-6">حول الموقع</h1>
            <p className="text-muted-foreground text-lg">منصة عربية متخصصة في تعليم الأمن السيبراني و اختبار الاختراق الأخلاقي</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          <div className="cyber-card">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-4">قصة الموقع</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                تم إطلاق هذا الموقع بتوفيق من الله و مجهود متواضع مني
                <br />
                ليكون مرجعاً لمن يريد البدء في هذا المجال بعيداً عن التشتت .
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                و كم تسرني مشاركة رأيكم و اقتراحاتكم لتحسين هذا المرجع
                <br />
                ليكون أول مرجع عربي لمتعلمين الأمن السيبراني .
              </p>
            </div>
          </div>

          <div className="cyber-card">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-white">رسالتنا</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>هذه المنصة تهتم بتوفير المصادر المتاحة على الإنترنت .</p>
                <p>سوف تجد أفضل المصادر العربية لتعلم الأمن السيبراني .</p>
                <p className="text-white font-bold text-lg">نؤمن بأن لدينا عقولاً و كفاءات جبارة في عالمنا العربي .</p>
              </div>
            </div>
          </div>

          <div className="cyber-card">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-primary/10">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-white">حقوق الملكية</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>جميع الحقوق و الملكيات محفوظة لأصحابها الأصليين .</p>
                <p>يتم توجيهك مباشرة للموقع أو المنصة الأصلية للمحتوى .</p>
                <p className="text-white font-bold">ما نحن إلا جسر يمهد لك طريق الوصول لهذه المصادر المتاحة على الإنترنت .</p>
              </div>
            </div>
          </div>

          <div className="cyber-card bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="relative z-10">
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-bold text-white">تواصل معنا</h2>
                <p className="text-muted-foreground">إذا كان هناك أي خطأ أو التباس تواصل معنا لإصلاحه فوراً .</p>
                <p className="text-muted-foreground">ساهم في تطوير هذا الموقع بتزويدنا بمصادر عن الكورسات المجانية على الإنترنت .</p>
                <div className="flex items-center justify-center gap-4 pt-4 flex-wrap">
                  <a href="https://www.instagram.com/gghteam/" target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Instagram" className="flex items-center justify-center w-12 h-12 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 group">
                    <Instagram className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  </a>
                  <a href="https://www.youtube.com/@GGHTEAM0" target="_blank" rel="noopener noreferrer" title="YouTube" aria-label="YouTube" className="flex items-center justify-center w-12 h-12 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 group">
                    <Youtube className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  </a>
                  <a href="https://www.tiktok.com/@gghteam1" target="_blank" rel="noopener noreferrer" title="TikTok" aria-label="TikTok" className="flex items-center justify-center w-12 h-12 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 group">
                    <TikTokLogo className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  </a>
                  <a href="https://t.me/GlobalGrayHatTeam" target="_blank" rel="noopener noreferrer" title="Telegram" aria-label="Telegram" className="flex items-center justify-center w-12 h-12 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 group">
                    <TelegramLogo className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  </a>
                  <a href="https://x.com/gghteam1" target="_blank" rel="noopener noreferrer" title="X" aria-label="X" className="flex items-center justify-center w-12 h-12 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 group">
                    <XLogo className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  </a>
                  <a href="https://substack.com/@gghteam" target="_blank" rel="noopener noreferrer" title="Substack" aria-label="Substack" className="flex items-center justify-center w-12 h-12 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 group">
                    <SubstackLogo className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
