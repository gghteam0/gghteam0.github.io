import { Link } from 'react-router-dom'
import { Instagram, Youtube, Heart } from 'lucide-react'
import { XLogo, TikTokLogo, TelegramLogo, SubstackLogo } from './ui.jsx'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-primary/20 bg-cyber-darker/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="logo.png" alt="GGH Team" className="h-10 w-auto rounded object-cover mix-blend-screen" />
              <span dir="ltr" className="font-display text-xl font-bold text-white">
                GGH Team
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              دليلك الشامل لإتقان الأمن السيبراني .
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider">روابط سريعة</h3>
            <div className="space-y-2">
              {[
                { path: '/', label: 'الرئيسية' },
                { path: '/roadmap', label: 'خريطة الطريق' },
                { path: '/tools', label: 'الأدوات' },
              ].map((l) => (
                <Link key={l.path} to={l.path} className="block text-muted-foreground text-sm hover:text-primary transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider">تواصل معنا</h3>
            <div className="flex gap-4 flex-wrap">
              <a href="https://www.instagram.com/gghteam/" target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-muted/30 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/@GGHTEAM0" target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-muted/30 text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-all duration-300" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://t.me/GlobalGrayHatTeam" target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-muted/30 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300" aria-label="Telegram">
                <TelegramLogo className="w-5 h-5" />
              </a>
              <a href="https://x.com/gghteam1" target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-muted/30 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300" aria-label="X">
                <XLogo className="w-5 h-5" />
              </a>
              <a href="https://www.tiktok.com/@gghteam1" target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-muted/30 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300" aria-label="TikTok">
                <TikTokLogo className="w-5 h-5" />
              </a>
              <a href="https://substack.com/@gghteam" target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-muted/30 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300" aria-label="Substack">
                <SubstackLogo className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-primary/10 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm text-center">
            جميع الحقوق محفوظة | © {year} <span dir="ltr">GGH Team</span>
            <br />
            <a href="https://t.me/GlobalGrayHatTeam" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">GGH Team</a>
          </p>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            صُنع بـ <Heart className="w-4 h-4 text-destructive" /> لمجتمع الأمن السيبراني
          </p>
        </div>
      </div>
    </footer>
  )
}
